import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storageDir = process.env.DATA_DIR || process.env.RENDER_DISK_PATH || __dirname;

if (!fs.existsSync(storageDir)) {
  try {
    fs.mkdirSync(storageDir, { recursive: true });
  } catch (e) {}
}

const DB_FILE = path.join(storageDir, 'db.json');
const INITIAL_DATA_FILE = path.join(__dirname, 'initialData.json');

// MongoDB Cloud Persistence (Free M0 Tier Support)
const MONGODB_URI = process.env.MONGODB_URI || '';
let isMongoConnected = false;

// Universal Document Schema for Cloud Storage
const CloudStoreSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, default: 'swiftklix_main_data' },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
  updatedAt: { type: Date, default: Date.now }
});

const CloudStore = mongoose.model('CloudStore', CloudStoreSchema);

let inMemoryData = null;

async function connectMongoIfConfigured() {
  if (!MONGODB_URI || isMongoConnected) return;
  try {
    await mongoose.connect(MONGODB_URI);
    isMongoConnected = true;
    console.log(' Successfully connected to 100% Free Persistent Cloud Database (MongoDB Atlas)');
    
    // Load existing cloud data
    const existing = await CloudStore.findOne({ key: 'swiftklix_main_data' });
    if (existing && existing.data && existing.data.organizations) {
      inMemoryData = existing.data;
      fs.writeFileSync(DB_FILE, JSON.stringify(inMemoryData, null, 2), 'utf-8');
      console.log(' Synced data from Cloud Database to local runtime.');
    } else {
      // First cloud seed from initialData
      const initialData = JSON.parse(fs.readFileSync(INITIAL_DATA_FILE, 'utf-8'));
      await CloudStore.findOneAndUpdate(
        { key: 'swiftklix_main_data' },
        { key: 'swiftklix_main_data', data: initialData, updatedAt: new Date() },
        { upsert: true, new: true }
      );
      inMemoryData = initialData;
      console.log(' Seeded initial dataset to Cloud Database.');
    }
  } catch (err) {
    console.error('MongoDB Cloud connection notice:', err.message);
  }
}

connectMongoIfConfigured();

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
    console.error('Error reading db.json, restoring initial data...', err);
    const initialData = fs.readFileSync(INITIAL_DATA_FILE, 'utf-8');
    fs.writeFileSync(DB_FILE, initialData, 'utf-8');
    inMemoryData = JSON.parse(initialData);
    return inMemoryData;
  }
}

function writeData(data) {
  inMemoryData = data;
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {}

  // Async sync to free cloud MongoDB if connected
  if (isMongoConnected) {
    CloudStore.findOneAndUpdate(
      { key: 'swiftklix_main_data' },
      { key: 'swiftklix_main_data', data: data, updatedAt: new Date() },
      { upsert: true }
    ).catch(err => console.error('Cloud async sync error:', err));
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
      membersCount: 1,
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

  getOpportunities() {
    const data = readData();
    return data.opportunities || [];
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

  getChapters() {
    const data = readData();
    return data.chapters || [];
  },

  createChapter(chapter) {
    const data = readData();
    const newChap = {
      id: `chap-${Date.now()}`,
      activeMembers: 1,
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
    const newMember = {
      id: `mem-${Date.now()}`,
      name: member.name,
      role: member.role || 'Volunteer Member',
      joinedAt: new Date().toISOString(),
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80`
    };

    chap.activeMembers = (chap.activeMembers || 0) + 1;
    chap.members = [newMember, ...(chap.members || [])];
    writeData(data);
    return chap;
  },

  getApplications() {
    const data = readData();
    return data.applications || [];
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

    // If approved and is chapter lead app, automatically charter chapter
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

  createImpactPost(post) {
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

  getPostsByOrg(orgId) {
    const data = readData();
    return (data.impactFeed || []).filter(p => p.orgId === orgId);
  }
};
