import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly resolve and load .env from all possible locations
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const storageDir = process.env.DATA_DIR || process.env.RENDER_DISK_PATH || __dirname;

if (!fs.existsSync(storageDir)) {
  try {
    fs.mkdirSync(storageDir, { recursive: true });
  } catch (e) {}
}

const DB_FILE = path.join(storageDir, 'db.json');
const INITIAL_DATA_FILE = path.join(__dirname, 'initialData.json');

// MongoDB Cloud Persistence - guaranteed connection with fallback to Atlas cluster
const FALLBACK_ATLAS_URI = 'mongodb+srv://swiftklix1_db_user:EfH8lrrrYUCw694Q@cluster0.xjpwc2f.mongodb.net/swiftklix?retryWrites=true&w=majority&appName=Cluster0';
const MONGODB_URI = process.env.MONGODB_URI || FALLBACK_ATLAS_URI;
let isMongoConnected = false;

// Universal Document Schema for Cloud Storage
const CloudStoreSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, default: 'swiftklix_main_data' },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
  updatedAt: { type: Date, default: Date.now }
});

const CloudStore = mongoose.models.CloudStore || mongoose.model('CloudStore', CloudStoreSchema);

let inMemoryData = null;

// Connection Event Listeners
mongoose.connection.on('connected', () => {
  isMongoConnected = true;
  console.log('[Database] MongoDB Atlas Connected.');
});

mongoose.connection.on('error', (err) => {
  console.error('[Database] MongoDB Atlas connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  isMongoConnected = false;
  console.log('[Database] MongoDB Atlas Disconnected. Reconnect will be attempted automatically.');
});

export async function initDbAsync() {
  if (MONGODB_URI && !isMongoConnected) {
    try {
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 6000,
        socketTimeoutMS: 45000
      });
      isMongoConnected = true;
      console.log('[Database] Verified Cloud Database connection.');
      
      const existing = await CloudStore.findOne({ key: 'swiftklix_main_data' });
      if (existing && existing.data && existing.data.organizations) {
        inMemoryData = existing.data;
        try {
          fs.writeFileSync(DB_FILE, JSON.stringify(inMemoryData, null, 2), 'utf-8');
        } catch (e) {}
        console.log('[Database] Loaded persistent data from Cloud Database into runtime.');
        return inMemoryData;
      } else {
        const initialData = JSON.parse(fs.readFileSync(INITIAL_DATA_FILE, 'utf-8'));
        await CloudStore.findOneAndUpdate(
          { key: 'swiftklix_main_data' },
          { $set: { key: 'swiftklix_main_data', data: initialData, updatedAt: new Date() } },
          { upsert: true, new: true }
        );
        inMemoryData = initialData;
        console.log('[Database] Initialized new Cloud Database store.');
        return inMemoryData;
      }
    } catch (err) {
      console.error('[Database] MongoDB startup notice:', err.message);
    }
  }

  // Fallback local file load
  initDb();
  readData();
  return inMemoryData;
}

function initDb() {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = fs.readFileSync(INITIAL_DATA_FILE, 'utf-8');
    fs.writeFileSync(DB_FILE, initialData, 'utf-8');
  }
}

function readData() {
  if (inMemoryData) return inMemoryData;
  initDb();
  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    inMemoryData = JSON.parse(content);
    return inMemoryData;
  } catch (err) {
    console.error('[Database] Error reading db.json, restoring initial data...', err);
    const initialData = fs.readFileSync(INITIAL_DATA_FILE, 'utf-8');
    fs.writeFileSync(DB_FILE, initialData, 'utf-8');
    inMemoryData = JSON.parse(initialData);
    return inMemoryData;
  }
}

function writeData(data) {
  inMemoryData = data;
  
  // 1. Atomic Local File Write
  try {
    const tmpFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tmpFile, DB_FILE);
  } catch (e) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {}
  }

  // 2. Atomic Cloud MongoDB Sync with Retry
  if (isMongoConnected) {
    CloudStore.findOneAndUpdate(
      { key: 'swiftklix_main_data' },
      { $set: { data: data, updatedAt: new Date() } },
      { upsert: true, new: true }
    ).catch(err => {
      console.error('[Database] Cloud sync error:', err.message);
      setTimeout(() => {
        if (isMongoConnected && inMemoryData) {
          CloudStore.findOneAndUpdate(
            { key: 'swiftklix_main_data' },
            { $set: { data: inMemoryData, updatedAt: new Date() } },
            { upsert: true, new: true }
          ).catch(retryErr => console.error('[Database] Cloud retry sync error:', retryErr.message));
        }
      }, 2000);
    });
  }
}

export const db = {
  getStats() {
    const data = readData();
    const orgs = data.organizations || [];
    const chapters = data.chapters || [];
    const opps = data.opportunities || [];
    const totalMembers = chapters.reduce((sum, c) => sum + (c.activeMembers || 0), 0) + orgs.reduce((sum, o) => sum + (o.membersCount || 0), 0);
    return {
      totalChapters: chapters.length,
      activeOrgs: orgs.length,
      totalMembers: totalMembers,
      activeProjectsCount: opps.length,
      campusFootprint: chapters.length
    };
  },

  getOrgs(includeAll = false) {
    const data = readData();
    const all = data.organizations || [];
    if (includeAll) return all;
    return all.filter(o => 
      o.approvalStatus === 'approved' || 
      o.status === 'Verified Official' || 
      o.status === 'Verified 501(c)(3)' ||
      o.status === 'Approved' ||
      o.isApproved === true
    );
  },

  getOrgById(id) {
    const orgs = this.getOrgs(true);
    return orgs.find(o => o.id === id);
  },

  createOrg(org) {
    const data = readData();
    const newOrg = {
      id: `org-${Date.now()}`,
      activeChaptersCount: 1,
      focusArea: org.focusArea || '',
      membersCount: org.membersCount !== undefined ? org.membersCount : 0,
      status: org.status || 'Pending Review',
      approvalStatus: org.approvalStatus || 'pending',
      isApproved: Boolean(org.isApproved),
      submittedBy: org.submittedBy || org.contactEmail || '',
      submittedAt: new Date().toISOString(),
      website: org.website || '',
      image: org.image || '',
      logo: org.logo || '',
      socials: org.socials || {
        linkedin: '',
        twitter: '',
        instagram: '',
        github: '',
        discord: '',
        tiktok: ''
      },
      verification: org.verification || {
        ein: org.ein || '',
        registryDoc: '',
        documentUrl: '',
        status: 'Pending Review',
        submittedAt: new Date().toISOString()
      },
      customQuestions: org.customQuestions || [],
      ...org,
      branchGuide: {
        curriculumOverview: org.curriculumOverview || '',
        guidelines: org.guidelines || '',
        legalSupport: org.legalSupport || '',
        toolkitAssets: org.toolkitAssets || []
      }
    };
    data.organizations = [newOrg, ...(data.organizations || [])];
    writeData(data);
    return newOrg;
  },

  approveOrg(id, adminNotes = '') {
    const data = readData();
    const index = (data.organizations || []).findIndex(o => o.id === id);
    if (index === -1) return null;

    data.organizations[index] = {
      ...data.organizations[index],
      status: 'Verified Official',
      approvalStatus: 'approved',
      isApproved: true,
      verification: {
        ...(data.organizations[index].verification || {}),
        status: 'Verified Official',
        adminNotes: adminNotes || 'Approved by SwiftKlix Platform Administrator',
        verifiedAt: new Date().toISOString()
      },
      approvedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    writeData(data);
    return data.organizations[index];
  },

  rejectOrg(id, rejectionReason = '') {
    const data = readData();
    const index = (data.organizations || []).findIndex(o => o.id === id);
    if (index === -1) return null;

    data.organizations[index] = {
      ...data.organizations[index],
      status: 'Rejected',
      approvalStatus: 'rejected',
      isApproved: false,
      rejectionReason: rejectionReason || 'Does not meet current verification criteria',
      updatedAt: new Date().toISOString()
    };
    writeData(data);
    return data.organizations[index];
  },

  updateOrg(id, updates) {
    const data = readData();
    const index = (data.organizations || []).findIndex(o => o.id === id);
    if (index === -1) return null;

    data.organizations[index] = {
      ...data.organizations[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    writeData(data);
    return data.organizations[index];
  },

  verifyOrg(id, status = 'Verified Official', adminNotes = '') {
    const data = readData();
    const index = (data.organizations || []).findIndex(o => o.id === id);
    if (index === -1) return null;

    const isVerified = status.includes('Verified');
    data.organizations[index] = {
      ...data.organizations[index],
      status: status,
      isVerified: isVerified,
      verification: {
        ...(data.organizations[index].verification || {}),
        status: status,
        adminNotes: adminNotes,
        verifiedAt: new Date().toISOString()
      },
      updatedAt: new Date().toISOString()
    };
    writeData(data);
    return data.organizations[index];
  },

  deleteOrg(id) {
    const data = readData();
    data.organizations = (data.organizations || []).filter(o => o.id !== id);
    data.chapters = (data.chapters || []).filter(c => c.orgId !== id);
    data.opportunities = (data.opportunities || []).filter(opp => opp.orgId !== id);
    data.applications = (data.applications || []).filter(app => app.orgId !== id);
    writeData(data);
    return true;
  },

  getOpportunities(filter = {}) {
    const data = readData();
    let opps = data.opportunities || [];
    if (filter.type) {
      opps = opps.filter(o => o.type === filter.type);
    }
    if (filter.orgId) {
      opps = opps.filter(o => o.orgId === filter.orgId);
    }
    if (filter.category) {
      opps = opps.filter(o => o.category === filter.category);
    }
    return opps;
  },

  createOpportunity(opp) {
    const data = readData();
    const newOpp = {
      id: `opp-${Date.now()}`,
      ...opp,
      createdAt: new Date().toISOString()
    };
    data.opportunities = [newOpp, ...(data.opportunities || [])];
    writeData(data);
    return newOpp;
  },

  updateOpportunity(id, updates) {
    const data = readData();
    const index = (data.opportunities || []).findIndex(o => o.id === id);
    if (index === -1) return null;

    data.opportunities[index] = {
      ...data.opportunities[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    writeData(data);
    return data.opportunities[index];
  },

  deleteOpportunity(id) {
    const data = readData();
    data.opportunities = (data.opportunities || []).filter(o => o.id !== id);
    writeData(data);
    return true;
  },

  getChapters(orgId = null) {
    const data = readData();
    let chapters = data.chapters || [];
    if (orgId) {
      chapters = chapters.filter(c => c.orgId === orgId);
    }
    return chapters;
  },

  createChapter(chapter) {
    const data = readData();
    const newChap = {
      id: `chap-${Date.now()}`,
      activeMembers: chapter.activeMembers !== undefined ? chapter.activeMembers : 0,
      eventsHosted: 0,
      recentEvent: 'Chapter Inauguration Pending',
      meetingSchedule: 'To be announced',
      ...chapter,
      createdAt: new Date().toISOString()
    };
    data.chapters = [newChap, ...(data.chapters || [])];
    writeData(data);
    return newChap;
  },

  updateChapter(id, updates) {
    const data = readData();
    const index = (data.chapters || []).findIndex(c => c.id === id);
    if (index === -1) return null;

    data.chapters[index] = {
      ...data.chapters[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    writeData(data);
    return data.chapters[index];
  },

  deleteChapter(id) {
    const data = readData();
    data.chapters = (data.chapters || []).filter(c => c.id !== id);
    writeData(data);
    return true;
  },

  addChapterEvent(chapterId, event) {
    const data = readData();
    const index = (data.chapters || []).findIndex(c => c.id === chapterId);
    if (index === -1) return null;

    const chap = data.chapters[index];
    const newEvent = {
      id: `event-${Date.now()}`,
      title: event.title,
      date: new Date().toISOString(),
      attendees: parseInt(event.attendees || 10, 10),
      photosCount: 2
    };

    chap.eventsHosted = (chap.eventsHosted || 0) + 1;
    chap.recentEvent = event.title;
    chap.events = [newEvent, ...(chap.events || [])];
    writeData(data);
    return chap;
  },

  addChapterMember(chapterId, member) {
    const data = readData();
    const index = (data.chapters || []).findIndex(c => c.id === chapterId);
    if (index === -1) return null;

    const chap = data.chapters[index];
    const memberName = typeof member === 'string' ? member : (member?.name || 'Volunteer Member');
    const memberRole = typeof member === 'object' ? (member?.role || 'Volunteer Member') : 'Volunteer Member';

    const newMember = {
      id: `mem-${Date.now()}`,
      name: memberName,
      role: memberRole,
      joinedAt: new Date().toISOString()
    };

    chap.activeMembers = (chap.activeMembers || 0) + 1;
    chap.members = [newMember, ...(chap.members || [])];
    writeData(data);
    return chap;
  },

  getApplications(orgId = null) {
    const data = readData();
    let apps = data.applications || [];
    if (orgId) {
      apps = apps.filter(a => a.orgId === orgId);
    }
    return apps;
  },

  createApplication(app) {
    const data = readData();
    const newApp = {
      id: `app-${Date.now()}`,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      ...app
    };
    data.applications = [newApp, ...(data.applications || [])];
    writeData(data);
    return newApp;
  },

  updateApplicationStatus(id, status, notes) {
    const data = readData();
    const index = (data.applications || []).findIndex(a => a.id === id);
    if (index === -1) return null;

    data.applications[index].status = status;
    if (notes) data.applications[index].notes = notes;
    data.applications[index].updatedAt = new Date().toISOString();

    const app = data.applications[index];

    // If approved and is chapter lead app, charter chapter
    if (status === 'approved' && (app.type === 'Start a Chapter' || app.type === 'Branch' || (app.role || '').toLowerCase().includes('lead') || (app.title || '').toLowerCase().includes('lead') || (app.title || '').toLowerCase().includes('branch') || (app.title || '').toLowerCase().includes('chapter'))) {
      const org = (data.organizations || []).find(o => o.id === app.orgId);
      const newChap = {
        id: `chap-${Date.now()}`,
        orgId: app.orgId,
        orgName: org ? org.name : (app.orgName || 'Organization'),
        name: `${app.role || app.title || 'Chapter'} - ${app.proposedLocation || 'Local Campus'}`,
        location: app.proposedLocation || 'Local Campus',
        institution: app.proposedLocation || 'Local Campus',
        leadName: app.applicantName,
        leadEmail: app.applicantEmail,
        activeMembers: 1,
        eventsHosted: 0,
        recentEvent: 'Chapter Inauguration Pending',
        meetingSchedule: 'Bi-weekly Wednesdays 6:00 PM',
        status: 'Active',
        createdAt: new Date().toISOString()
      };
      data.chapters = [newChap, ...(data.chapters || [])];
      
      if (org) {
        org.activeChaptersCount = (org.activeChaptersCount || 0) + 1;
      }
    }

    writeData(data);
    return data.applications[index];
  },

  getMatchmaking() {
    const data = readData();
    return data.matchmakingProfiles || [];
  },

  createMatchmaking(profile) {
    const data = readData();
    const newProfile = {
      id: `match-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...profile
    };
    data.matchmakingProfiles = [newProfile, ...(data.matchmakingProfiles || [])];
    writeData(data);
    return newProfile;
  },

  getImpactFeed() {
    const data = readData();
    return data.impactFeed || [];
  },

  getPosts(orgId = null) {
    const data = readData();
    let posts = data.impactFeed || [];
    if (orgId) {
      posts = posts.filter(p => p.orgId === orgId);
    }
    return posts;
  },

  createPost(post) {
    const data = readData();
    const newPost = {
      id: `post-${Date.now()}`,
      likes: 0,
      shares: 0,
      createdAt: new Date().toISOString(),
      ...post
    };
    data.impactFeed = [newPost, ...(data.impactFeed || [])];
    writeData(data);
    return newPost;
  },

  likePost(id) {
    const data = readData();
    const index = (data.impactFeed || []).findIndex(p => p.id === id);
    if (index === -1) return null;

    data.impactFeed[index].likes = (data.impactFeed[index].likes || 0) + 1;
    writeData(data);
    return data.impactFeed[index];
  }
};
