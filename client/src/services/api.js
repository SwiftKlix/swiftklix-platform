const BASE_URL = '/api';

export const api = {
  async getStats() {
    const res = await fetch(`${BASE_URL}/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  async getOrgs(includeAll = false) {
    const res = await fetch(`${BASE_URL}/orgs${includeAll ? '?all=true' : ''}`);
    if (!res.ok) throw new Error('Failed to fetch orgs');
    return res.json();
  },

  async getOrgById(id) {
    const res = await fetch(`${BASE_URL}/orgs/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch org ${id}`);
    return res.json();
  },

  async createOrg(org) {
    const res = await fetch(`${BASE_URL}/orgs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(org)
    });
    if (!res.ok) throw new Error('Failed to create org');
    return res.json();
  },

  async approveOrg(id, notes = '') {
    const res = await fetch(`${BASE_URL}/orgs/${id}/approve`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes })
    });
    if (!res.ok) throw new Error('Failed to approve organization');
    return res.json();
  },

  async rejectOrg(id, reason = '') {
    const res = await fetch(`${BASE_URL}/orgs/${id}/reject`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    });
    if (!res.ok) throw new Error('Failed to reject organization');
    return res.json();
  },

  async updateOrg(id, orgData) {
    const res = await fetch(`${BASE_URL}/orgs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orgData)
    });
    if (!res.ok) throw new Error('Failed to update org');
    return res.json();
  },

  async verifyOrg(id, status = 'Verified Official', adminNotes = '') {
    const res = await fetch(`${BASE_URL}/orgs/${id}/verify`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, adminNotes })
    });
    if (!res.ok) throw new Error('Failed to update org verification status');
    return res.json();
  },

  async deleteOrg(id) {
    const res = await fetch(`${BASE_URL}/orgs/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete org');
    return res.json();
  },

  // Community Activity Posts
  async getPosts(orgId) {
    const url = orgId ? `${BASE_URL}/posts?orgId=${orgId}` : `${BASE_URL}/posts`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch posts');
    return res.json();
  },

  async createPost(post) {
    const res = await fetch(`${BASE_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post)
    });
    if (!res.ok) throw new Error('Failed to create post');
    return res.json();
  },

  async likePost(postId) {
    const res = await fetch(`${BASE_URL}/posts/${postId}/like`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to like post');
    return res.json();
  },

  async getOpportunities(filter = {}) {
    const params = new URLSearchParams();
    if (filter.type) params.append('type', filter.type);
    if (filter.orgId) params.append('orgId', filter.orgId);
    if (filter.category) params.append('category', filter.category);
    if (filter.location) params.append('location', filter.location);

    const res = await fetch(`${BASE_URL}/opportunities?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch opportunities');
    return res.json();
  },

  async createOpportunity(opportunity) {
    const res = await fetch(`${BASE_URL}/opportunities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(opportunity)
    });
    if (!res.ok) throw new Error('Failed to create opportunity');
    return res.json();
  },

  async updateOpportunity(id, data) {
    const res = await fetch(`${BASE_URL}/opportunities/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update opportunity');
    return res.json();
  },

  async updateOpportunityStatus(id, status, spotsAvailable) {
    const res = await fetch(`${BASE_URL}/opportunities/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, spotsAvailable })
    });
    if (!res.ok) throw new Error('Failed to update opportunity status');
    return res.json();
  },

  async deleteOpportunity(id) {
    const res = await fetch(`${BASE_URL}/opportunities/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete opportunity');
    return res.json();
  },

  async getMatchmaking() {
    const res = await fetch(`${BASE_URL}/matchmaking`);
    if (!res.ok) throw new Error('Failed to fetch matchmaking profiles');
    return res.json();
  },

  async createMatchmaking(profile) {
    const res = await fetch(`${BASE_URL}/matchmaking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    });
    if (!res.ok) throw new Error('Failed to create matchmaking profile');
    return res.json();
  },

  async getApplications(orgId) {
    const url = orgId ? `${BASE_URL}/applications?orgId=${orgId}` : `${BASE_URL}/applications`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch applications');
    return res.json();
  },

  async createApplication(application) {
    const res = await fetch(`${BASE_URL}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(application)
    });
    if (!res.ok) throw new Error('Failed to create application');
    return res.json();
  },

  async updateApplicationStatus(id, status, notes = '') {
    const res = await fetch(`${BASE_URL}/applications/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes })
    });
    if (!res.ok) throw new Error('Failed to update application status');
    return res.json();
  },

  async getChapters(orgId) {
    const url = orgId ? `${BASE_URL}/chapters?orgId=${orgId}` : `${BASE_URL}/chapters`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch chapters');
    return res.json();
  },

  async createChapterEvent(chapterId, event) {
    const res = await fetch(`${BASE_URL}/chapters/${chapterId}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    });
    if (!res.ok) throw new Error('Failed to log event');
    return res.json();
  },

  async addChapterMember(chapterId, memberName) {
    const res = await fetch(`${BASE_URL}/chapters/${chapterId}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: memberName })
    });
    if (!res.ok) throw new Error('Failed to add chapter member');
    return res.json();
  },

  async updateChapter(id, data) {
    const res = await fetch(`${BASE_URL}/chapters/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update branch');
    return res.json();
  },

  async createChapter(chapter) {
    const res = await fetch(`${BASE_URL}/chapters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(chapter)
    });
    if (!res.ok) throw new Error('Failed to create branch');
    return res.json();
  },

  async deleteChapter(id) {
    const res = await fetch(`${BASE_URL}/chapters/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete branch');
    return res.json();
  },

  async resetDatabase() {
    const res = await fetch(`${BASE_URL}/reset`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to reset database');
    return res.json();
  }
};

