import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db } from './data/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Platform overview & stats
app.get('/api/stats', (req, res) => {
  const stats = db.getStats();
  res.json(stats);
});

// Organizations
app.get('/api/orgs', (req, res) => {
  const includeAll = req.query.all === 'true' || req.query.includePending === 'true';
  const orgs = db.getOrgs(includeAll);
  res.json(orgs);
});

app.get('/api/orgs/:id', (req, res) => {
  const org = db.getOrgById(req.params.id);
  if (!org) {
    return res.status(404).json({ error: 'Organization not found' });
  }
  res.json(org);
});

app.post('/api/orgs', (req, res) => {
  const { name, tagline, category, headquarters, description, focusArea, contactEmail, website, image, logo, socials, verification, customQuestions, submittedBy, approvalStatus } = req.body;
  if (!name || !tagline) {
    return res.status(400).json({ error: 'name and tagline are required' });
  }
  const newOrg = db.createOrg({
    name,
    tagline,
    category: category || 'Community',
    headquarters: headquarters || 'National',
    description: description || '',
    focusArea: focusArea || 'Active Chapter',
    contactEmail: contactEmail || 'hello@nonprofit.org',
    submittedBy: submittedBy || contactEmail || '',
    website: website || 'https://nonprofit.org',
    image: image || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    logo: logo || '',
    socials: socials || {},
    verification: verification || {
      ein: '84-1928472',
      registryDoc: 'Official 501(c)(3) Letter',
      status: 'Pending Review'
    },
    customQuestions: customQuestions || [],
    approvalStatus: approvalStatus || 'pending'
  });
  res.status(201).json(newOrg);
});

app.put('/api/orgs/:id', (req, res) => {
  const updated = db.updateOrg(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Organization not found' });
  }
  res.json(updated);
});

app.patch('/api/orgs/:id', (req, res) => {
  const updated = db.updateOrg(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Organization not found' });
  }
  res.json(updated);
});

// Admin Approval Endpoints
app.patch('/api/orgs/:id/approve', (req, res) => {
  const { notes } = req.body || {};
  const approved = db.approveOrg(req.params.id, notes);
  if (!approved) {
    return res.status(404).json({ error: 'Organization not found' });
  }
  res.json(approved);
});

app.patch('/api/orgs/:id/reject', (req, res) => {
  const { reason } = req.body || {};
  const rejected = db.rejectOrg(req.params.id, reason);
  if (!rejected) {
    return res.status(404).json({ error: 'Organization not found' });
  }
  res.json(rejected);
});

// Admin Verification Endpoint: Grant or Update Verified Badge
app.patch('/api/orgs/:id/verify', (req, res) => {
  const { status, adminNotes } = req.body;
  const updated = db.verifyOrg(req.params.id, status || 'Verified Official', adminNotes);
  if (!updated) {
    return res.status(404).json({ error: 'Organization not found' });
  }
  res.json(updated);
});

// Delete Organization
app.delete('/api/orgs/:id', (req, res) => {
  const success = db.deleteOrg(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Organization not found' });
  }
  res.json({ message: 'Organization deleted successfully' });
});

// Community Activity & Updates
app.get('/api/posts', (req, res) => {
  const { orgId } = req.query;
  const posts = db.getPosts(orgId);
  res.json(posts);
});

app.post('/api/posts', (req, res) => {
  const { orgId, orgName, authorName, authorRole, title, content, image } = req.body;
  if (!orgId || !content) {
    return res.status(400).json({ error: 'orgId and content are required' });
  }
  const newPost = db.createPost({
    orgId,
    orgName: orgName || 'Organization',
    authorName: authorName || 'Team Lead',
    authorRole: authorRole || 'Organizer',
    title: title || '',
    content,
    image: image || ''
  });
  res.status(201).json(newPost);
});

app.post('/api/posts/:id/like', (req, res) => {
  const updated = db.likePost(req.params.id);
  if (!updated) {
    return res.status(404).json({ error: 'Post not found' });
  }
  res.json(updated);
});

// Opportunities & Positions
app.get('/api/opportunities', (req, res) => {
  const filter = {
    type: req.query.type,
    orgId: req.query.orgId,
    category: req.query.category,
    location: req.query.location
  };
  const opps = db.getOpportunities(filter);
  res.json(opps);
});

app.post('/api/opportunities', (req, res) => {
  const { orgId, orgName, title, type, targetLocation, commitment, focusArea, category, spotsAvailable, description, tags } = req.body;
  if (!title || !orgId) {
    return res.status(400).json({ error: 'title and orgId are required' });
  }
  const newOpp = db.createOpportunity({
    orgId,
    orgName: orgName || 'Organization',
    title,
    type: type || 'Start a Chapter',
    targetLocation: targetLocation || 'National / Remote',
    commitment: commitment || '3-4 hours / week',
    focusArea: focusArea || 'Active Chapter',
    category: category || 'Community',
    deadline: 'Open',
    spotsAvailable: Number(spotsAvailable) || 2,
    description: description || '',
    requirements: ['Passionate about community impact', 'Reliable communicator'],
    benefits: ['Direct branch opening', 'Materials and slide templates'],
    tags: tags || ['Branch Lead']
  });
  res.status(201).json(newOpp);
});

app.put('/api/opportunities/:id', (req, res) => {
  const updated = db.updateOpportunity(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Opportunity not found' });
  }
  res.json(updated);
});

app.patch('/api/opportunities/:id/status', (req, res) => {
  const { status, spotsAvailable } = req.body;
  const updates = {};
  if (status !== undefined) updates.status = status;
  if (spotsAvailable !== undefined) updates.spotsAvailable = Number(spotsAvailable);
  const updated = db.updateOpportunity(req.params.id, updates);
  if (!updated) {
    return res.status(404).json({ error: 'Opportunity not found' });
  }
  res.json(updated);
});

app.delete('/api/opportunities/:id', (req, res) => {
  const success = db.deleteOpportunity(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Opportunity not found' });
  }
  res.json({ message: 'Opportunity deleted successfully' });
});

// Co-Founder & Matchmaking
app.get('/api/matchmaking', (req, res) => {
  const profiles = db.getMatchmaking();
  res.json(profiles);
});

app.post('/api/matchmaking', (req, res) => {
  const { name, headline, location, skills, lookingFor, bio, contactEmail } = req.body;
  if (!name || !headline) {
    return res.status(400).json({ error: 'name and headline are required' });
  }
  const newProfile = db.createMatchmaking({
    name,
    headline,
    location: location || 'Remote',
    skills: skills || [],
    lookingFor: lookingFor || 'A partner to co-lead a branch',
    bio: bio || '',
    contactEmail: contactEmail || 'user@example.org'
  });
  res.status(201).json(newProfile);
});

// Applications CRM
app.get('/api/applications', (req, res) => {
  const { orgId } = req.query;
  const applications = db.getApplications(orgId);
  res.json(applications);
});

app.post('/api/applications', (req, res) => {
  const { 
    orgId, 
    orgName,
    opportunityId, 
    applicantName, 
    applicantEmail, 
    proposedLocation, 
    role, 
    title, 
    type, 
    background, 
    plan, 
    answers, 
    responses,
    committee, 
    chapterId, 
    affiliation, 
    commitment, 
    status 
  } = req.body;

  if (!applicantName || !applicantEmail || !orgId) {
    return res.status(400).json({ error: 'applicantName, applicantEmail, and orgId are required' });
  }

  let finalOrgName = orgName;
  if (!finalOrgName) {
    const org = db.getOrgById(orgId);
    if (org) finalOrgName = org.name;
  }

  const newApp = db.createApplication({
    orgId,
    orgName: finalOrgName || 'Organization',
    opportunityId: opportunityId || '',
    applicantName,
    applicantEmail,
    proposedLocation: proposedLocation || 'Local Campus',
    role: role || title || 'Start a Branch or Chapter',
    title: title || role || 'Start a Branch or Chapter',
    type: type || 'Start a Chapter',
    chapterId: chapterId || null,
    committee: committee || 'General Volunteer',
    affiliation: affiliation || 'Student / Local Resident',
    background: background || '',
    plan: plan || '',
    answers: answers || responses || {},
    weeklyAvailability: commitment || '2-3 hours/week',
    commitment: commitment || '2-3 hours/week',
    experienceYears: '1 year'
  });

  if (status === 'approved') {
    const approvedApp = db.updateApplicationStatus(newApp.id, 'approved', 'Auto-confirmed branch or chapter member.');
    return res.status(201).json(approvedApp || newApp);
  }

  res.status(201).json(newApp);
});

app.patch('/api/applications/:id/status', (req, res) => {
  const { status, notes } = req.body;
  const updated = db.updateApplicationStatus(req.params.id, status, notes);
  if (!updated) {
    return res.status(404).json({ error: 'Application not found' });
  }
  res.json(updated);
});

// Active Chapters & Branches
app.get('/api/chapters', (req, res) => {
  const { orgId } = req.query;
  const chapters = db.getChapters(orgId);
  res.json(chapters);
});

app.post('/api/chapters/:id/events', (req, res) => {
  const { title, attendees } = req.body;
  const updated = db.addChapterEvent(req.params.id, { title, attendees });
  if (!updated) {
    return res.status(404).json({ error: 'Branch not found' });
  }
  res.json(updated);
});

app.post('/api/chapters/:id/members', (req, res) => {
  const { name } = req.body;
  const updated = db.addChapterMember(req.params.id, name);
  if (!updated) {
    return res.status(404).json({ error: 'Branch not found' });
  }
  res.json(updated);
});

app.put('/api/chapters/:id', (req, res) => {
  const updated = db.updateChapter(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Branch not found' });
  }
  res.json(updated);
});

app.post('/api/chapters', (req, res) => {
  const newChapter = db.createChapter(req.body);
  res.status(201).json(newChapter);
});

app.delete('/api/chapters/:id', (req, res) => {
  const success = db.deleteChapter(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Branch not found' });
  }
  res.json({ message: 'Branch removed successfully' });
});

// Reset Database to Seed
app.post('/api/reset', (req, res) => {
  db.reset();
  res.json({ message: 'Database reset to initial sample seed successfully.' });
});

// Dedicated Static Legal Pages for Google OAuth Compliance & Verification
app.get('/privacy', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/privacy.html'));
});

app.get('/terms', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/terms.html'));
});

// Serve compiled Frontend statically in production
const clientDist = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(clientDist, 'index.html'));
    }
  });
}

app.listen(PORT, () => {
  console.log(`Canopy Full-Stack Server running on http://localhost:${PORT}`);
});

