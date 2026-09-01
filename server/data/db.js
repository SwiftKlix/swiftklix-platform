import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db.json');
const INITIAL_DATA_FILE = path.join(__dirname, 'initialData.json');

function initDb() {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = fs.readFileSync(INITIAL_DATA_FILE, 'utf-8');
    fs.writeFileSync(DB_FILE, initialData, 'utf-8');
  }
}

function readData() {
  initDb();
  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading db.json, restoring initial data...', err);
    const initialData = fs.readFileSync(INITIAL_DATA_FILE, 'utf-8');
    fs.writeFileSync(DB_FILE, initialData, 'utf-8');
    return JSON.parse(initialData);
  }
}

function writeData(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export const db = {
  getStats() {
    const data = readData();
    return data.stats;
  },

  getOrgs() {
    const data = readData();
    return data.organizations || [];
  },

  getOrgById(id) {
    const orgs = this.getOrgs();
    return orgs.find(o => o.id === id);
  },

  createOrg(org) {
    const data = readData();
    const newOrg = {
      id: `org-${Date.now()}`,
      activeChaptersCount: 1,
      focusArea: org.focusArea || 'Active Chapter',
      membersCount: 1,
      status: org.verification?.status || 'Verified Official',
      image: org.image || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
      logo: org.logo || '',
      socials: org.socials || {
        linkedin: '',
        twitter: '',
        instagram: '',
        github: '',
        discord: ''
      },
      verification: org.verification || {
        ein: '84-1928472',
        registryDoc: 'Official 501(c)(3) IRS Determination Letter',
        status: 'Verified Official',
        verifiedAt: new Date().toISOString()
      },
      customQuestions: org.customQuestions || [
        "Why do you want to lead a branch in your city?",
        "What relevant volunteer or club leadership experience do you have?"
      ],
      ...org,
      branchGuide: {
        curriculumOverview: org.curriculumOverview || 'Step-by-step meeting guide and volunteer handbook.',
        guidelines: org.guidelines || 'Official chapter guidelines and resources.',
        legalSupport: '501(c)(3) tax umbrella and liability coverage.',
        toolkitAssets: ['Volunteer Guide', 'Poster Templates', 'Budget Sheet']
      }
    };
    data.organizations = [newOrg, ...(data.organizations || [])];
    if (data.stats) {
      data.stats.activeOrgs = (data.stats.activeOrgs || 0) + 1;
    }
    writeData(data);
    return newOrg;
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
        verifiedAt: isVerified ? new Date().toISOString() : null
      },
      updatedAt: new Date().toISOString()
    };
    writeData(data);
    return data.organizations[index];
  },

  deleteOrg(id) {
    const data = readData();
    const beforeCount = (data.organizations || []).length;
    data.organizations = (data.organizations || []).filter(o => o.id !== id);
    data.opportunities = (data.opportunities || []).filter(o => o.orgId !== id);
    data.applications = (data.applications || []).filter(a => a.orgId !== id);
    data.posts = (data.posts || []).filter(p => p.orgId !== id);
    
    if (data.stats) {
      data.stats.activeOrgs = data.organizations.length;
    }
    writeData(data);
    return data.organizations.length < beforeCount;
  },

  // Community Activity / Posts
  getPosts(orgId) {
    const data = readData();
    let posts = data.posts || [];
    if (orgId) {
      posts = posts.filter(p => p.orgId === orgId);
    }
    return posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  createPost(post) {
    const data = readData();
    const newPost = {
      id: `post-${Date.now()}`,
      likes: 0,
      commentsCount: 0,
      createdAt: new Date().toISOString(),
      ...post
    };
    data.posts = [newPost, ...(data.posts || [])];
    writeData(data);
    return newPost;
  },

  likePost(postId) {
    const data = readData();
    const postIndex = (data.posts || []).findIndex(p => p.id === postId);
    if (postIndex === -1) return null;
    data.posts[postIndex].likes = (data.posts[postIndex].likes || 0) + 1;
    writeData(data);
    return data.posts[postIndex];
  },

  // Opportunities & Positions
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
      opps = opps.filter(o => o.category?.toLowerCase().includes(filter.category.toLowerCase()));
    }
    if (filter.location) {
      opps = opps.filter(o => o.targetLocation?.toLowerCase().includes(filter.location.toLowerCase()));
    }
    return opps;
  },

  createOpportunity(opportunity) {
    const data = readData();
    const newOpp = {
      id: `opp-${Date.now()}`,
      status: 'open',
      deadline: 'Open',
      createdAt: new Date().toISOString(),
      ...opportunity
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
    const initialLen = (data.opportunities || []).length;
    data.opportunities = (data.opportunities || []).filter(o => o.id !== id);
    writeData(data);
    return data.opportunities.length < initialLen;
  },

  getMatchmaking() {
    const data = readData();
    return data.matchmaking || [];
  },

  createMatchmaking(profile) {
    const data = readData();
    const newProfile = {
      id: `match-${Date.now()}`,
      createdAt: new Date().toISOString(),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      ...profile
    };
    data.matchmaking = [newProfile, ...(data.matchmaking || [])];
    writeData(data);
    return newProfile;
  },

  getApplications(orgId) {
    const data = readData();
    let apps = data.applications || [];
    if (orgId) {
      apps = apps.filter(a => a.orgId === orgId);
    }
    return apps;
  },

  createApplication(application) {
    const data = readData();
    const newApp = {
      id: `app-${Date.now()}`,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      notes: 'New applicant. Ready for review.',
      ...application
    };
    data.applications = [newApp, ...(data.applications || [])];
    writeData(data);
    return newApp;
  },

  updateApplicationStatus(id, status, notes) {
    const data = readData();
    const appIndex = (data.applications || []).findIndex(a => String(a.id) === String(id));
    if (appIndex === -1) return null;

    data.applications[appIndex].status = status;
    if (notes !== undefined) {
      data.applications[appIndex].notes = notes;
    }
    data.applications[appIndex].updatedAt = new Date().toISOString();

    if (status === 'approved') {
      const app = data.applications[appIndex];
      const isMemberSignup = app.type === 'Branch Member' || app.type === 'Join Branch' || (app.role || '').includes('Member');
      const isBranchFounding = !isMemberSignup && (app.type === 'Start a Chapter' || app.type === 'Branch' || (app.role || '').toLowerCase().includes('branch') || (app.role || '').toLowerCase().includes('chapter') || (app.role || '').toLowerCase().includes('founding'));

      if (isBranchFounding) {
        // Charter a new branch or chapter with the founding lead as director
        const newChapter = {
          id: `chap-${Date.now()}`,
          orgId: app.orgId,
          name: `${app.role} - ${app.proposedLocation}`,
          leadName: app.applicantName,
          leadEmail: app.applicantEmail,
          location: app.proposedLocation,
          institution: app.proposedLocation,
          activeMembers: 1,
          eventsHosted: 0,
          recentEvent: 'Branch or Chapter Chartered',
          status: 'Active'
        };
        data.chapters = [newChapter, ...(data.chapters || [])];
        
        const orgIndex = (data.organizations || []).findIndex(o => o.id === app.orgId);
        if (orgIndex !== -1) {
          data.organizations[orgIndex].activeChaptersCount = (data.organizations[orgIndex].activeChaptersCount || 0) + 1;
          data.organizations[orgIndex].membersCount = (data.organizations[orgIndex].membersCount || 0) + 1;
        }
        if (data.stats) {
          data.stats.totalChapters = (data.stats.totalChapters || 0) + 1;
          data.stats.totalMembers = (data.stats.totalMembers || 0) + 1;
        }
      } else if (isMemberSignup) {
        // Regular volunteer / member joining: increment branch or chapter volunteer count
        // Personal info stays strictly private in CRM; only headcount increments publicly
        let chapterUpdated = false;
        if (app.chapterId) {
          const chapIdx = (data.chapters || []).findIndex(c => c.id === app.chapterId);
          if (chapIdx !== -1) {
            data.chapters[chapIdx].activeMembers = (data.chapters[chapIdx].activeMembers || 15) + 1;
            chapterUpdated = true;
          }
        }
        if (!chapterUpdated) {
          const chapIdx = (data.chapters || []).findIndex(c => c.orgId === app.orgId && (c.location === app.proposedLocation || c.institution === app.proposedLocation));
          if (chapIdx !== -1) {
            data.chapters[chapIdx].activeMembers = (data.chapters[chapIdx].activeMembers || 15) + 1;
          }
        }
        const orgIndex = (data.organizations || []).findIndex(o => o.id === app.orgId);
        if (orgIndex !== -1) {
          data.organizations[orgIndex].membersCount = (data.organizations[orgIndex].membersCount || 0) + 1;
        }
        if (data.stats) {
          data.stats.totalMembers = (data.stats.totalMembers || 0) + 1;
        }
      } else {
        // Position / Core Team Volunteer
        const orgIndex = (data.organizations || []).findIndex(o => o.id === app.orgId);
        if (orgIndex !== -1) {
          data.organizations[orgIndex].membersCount = (data.organizations[orgIndex].membersCount || 0) + 1;
        }
        if (data.stats) {
          data.stats.totalMembers = (data.stats.totalMembers || 0) + 1;
        }
      }
    }

    writeData(data);
    return data.applications[appIndex];
  },

  getChapters(orgId) {
    const data = readData();
    let chapters = data.chapters || [];
    if (orgId) {
      chapters = chapters.filter(c => c.orgId === orgId);
    }
    return chapters;
  },

  addChapterEvent(chapterId, event) {
    const data = readData();
    const chapterIndex = (data.chapters || []).findIndex(c => c.id === chapterId);
    if (chapterIndex === -1) return null;

    data.chapters[chapterIndex].eventsHosted = (data.chapters[chapterIndex].eventsHosted || 0) + 1;
    data.chapters[chapterIndex].recentEvent = event.title;
    writeData(data);
    return data.chapters[chapterIndex];
  },

  addChapterMember(chapterId, memberName) {
    const data = readData();
    const chapterIndex = (data.chapters || []).findIndex(c => c.id === chapterId);
    if (chapterIndex === -1) return null;

    data.chapters[chapterIndex].activeMembers = (data.chapters[chapterIndex].activeMembers || 0) + 1;
    if (data.stats) {
      data.stats.totalMembers = (data.stats.totalMembers || 0) + 1;
    }
    writeData(data);
    return data.chapters[chapterIndex];
  },

  updateChapter(chapterId, updates) {
    const data = readData();
    const chapterIndex = (data.chapters || []).findIndex(c => c.id === chapterId);
    if (chapterIndex === -1) return null;

    data.chapters[chapterIndex] = {
      ...data.chapters[chapterIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    writeData(data);
    return data.chapters[chapterIndex];
  },

  createChapter(chapterData) {
    const data = readData();
    const newChapter = {
      id: `chap-${Date.now()}`,
      activeMembers: 1,
      eventsHosted: 0,
      recentEvent: 'Chartered',
      status: 'Active',
      ...chapterData
    };
    data.chapters = [newChapter, ...(data.chapters || [])];

    const orgIndex = (data.organizations || []).findIndex(o => o.id === chapterData.orgId);
    if (orgIndex !== -1) {
      data.organizations[orgIndex].activeChaptersCount = (data.organizations[orgIndex].activeChaptersCount || 0) + 1;
    }
    if (data.stats) {
      data.stats.totalChapters = (data.stats.totalChapters || 0) + 1;
    }
    writeData(data);
    return newChapter;
  },

  deleteChapter(chapterId) {
    const data = readData();
    const initialLen = (data.chapters || []).length;
    const chap = (data.chapters || []).find(c => c.id === chapterId);
    data.chapters = (data.chapters || []).filter(c => c.id !== chapterId);
    
    if (chap && data.stats) {
      data.stats.totalChapters = Math.max(0, (data.stats.totalChapters || 1) - 1);
    }
    writeData(data);
    return data.chapters.length < initialLen;
  },

  reset() {
    const initialData = fs.readFileSync(INITIAL_DATA_FILE, 'utf-8');
    fs.writeFileSync(DB_FILE, initialData, 'utf-8');
  }
};

