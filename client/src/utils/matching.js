/**
 * Transparent Multi-Factor Compatibility Matching Engine for SwiftKlix
 * 
 * Weights:
 * - Cause & Mission Match: 45%
 * - Location & Chapter Proximity: 35%
 * - Role & Opportunity Type: 12%
 * - Weekly Availability / Bandwidth: 8%
 */

export function calculateMatchScore(item, prefs, chapters = []) {
  if (!prefs || !prefs.completed) return null;

  const itemCategory = (item?.category || '').trim().toLowerCase();
  const itemRole = (item?.role || item?.type || item?.title || '').trim().toLowerCase();
  const itemLocation = (item?.targetLocation || item?.headquarters || '').trim().toLowerCase();
  const itemCommitment = (item?.commitment || '').trim().toLowerCase();
  const userLoc = (typeof prefs.userLocation === 'string' ? prefs.userLocation : '').trim().toLowerCase();

  let causeScore = 0;
  let locationScore = 0;
  let roleScore = 0;
  let availabilityScore = 0;

  // 1. Cause & Mission Match (0 to 45 pts)
  if (prefs.causes && Array.isArray(prefs.causes) && prefs.causes.length > 0) {
    const isDirectMatch = prefs.causes.some(c => {
      const cleanC = (c || '').toLowerCase();
      return itemCategory.includes(cleanC) || cleanC.includes(itemCategory);
    });

    if (isDirectMatch) {
      causeScore = 45;
    } else {
      // Check partial keyword overlap
      const itemWords = itemCategory.split(/[\s,&/]+/).filter(w => w.length > 3);
      const partialMatch = prefs.causes.some(c => {
        const cWords = (c || '').toLowerCase().split(/[\s,&/]+/).filter(w => w.length > 3);
        return itemWords.some(iw => cWords.includes(iw));
      });
      if (partialMatch) {
        causeScore = 24;
      } else {
        causeScore = 4; // Minimal baseline if no cause overlap
      }
    }
  } else {
    causeScore = 20; // Neutral if no cause filter set
  }

  // 2. Location & Chapter Proximity (0 to 35 pts)
  if (!userLoc || userLoc === 'remote / all locations' || userLoc === 'any') {
    locationScore = 25; // Neutral nationwide baseline
  } else {
    const locKeywords = userLoc.split(/[\s,&/]+/).filter(w => w.length > 2);
    const isDirectLocation = locKeywords.some(kw => itemLocation.includes(kw));

    // Check if organization has an active chapter in user's city/campus
    const orgId = item?.id || item?.orgId;
    let hasLocalChapter = false;
    if (orgId && Array.isArray(chapters)) {
      hasLocalChapter = chapters.some(c => 
        c.orgId === orgId && locKeywords.some(kw => 
          (c.location || '').toLowerCase().includes(kw) ||
          (c.institution || '').toLowerCase().includes(kw) ||
          (c.name || '').toLowerCase().includes(kw)
        )
      );
    }

    if (hasLocalChapter || isDirectLocation) {
      locationScore = 35; // Direct municipal / campus match
    } else if (itemLocation.includes('remote') || itemLocation.includes('all locations')) {
      locationScore = 22; // Accessible remote
    } else {
      // Check state-level proximity
      const userState = userLoc.split(',')[1]?.trim();
      const itemState = itemLocation.split(',')[1]?.trim();
      if (userState && itemState && userState.toLowerCase() === itemState.toLowerCase()) {
        locationScore = 18; // Same state
      } else if (prefs.onlyLocal) {
        locationScore = 0; // Filtered out by strict local filter
      } else {
        locationScore = 5; // Different city
      }
    }
  }

  // 3. Role Intent Match (0 to 12 pts)
  if (prefs.roleType) {
    const isBranchRole = itemRole.includes('branch') || itemRole.includes('chapter') || itemRole.includes('founding') || itemRole.includes('lead');
    const isVolunteerRole = itemRole.includes('member') || itemRole.includes('volunteer') || itemRole.includes('position') || itemRole.includes('coordinator');

    if (prefs.roleType === 'branch' && isBranchRole) {
      roleScore = 12;
    } else if (prefs.roleType === 'volunteer' && isVolunteerRole) {
      roleScore = 12;
    } else if (prefs.roleType === 'both') {
      roleScore = 10;
    } else {
      roleScore = 4;
    }
  } else {
    roleScore = 8;
  }

  // 4. Availability & Bandwidth Match (0 to 8 pts)
  if (prefs.availability) {
    if (prefs.availability === 'low' && (itemCommitment.includes('1-2') || itemCommitment.includes('flexible') || itemCommitment.includes('2-3'))) {
      availabilityScore = 8;
    } else if (prefs.availability === 'medium' && (itemCommitment.includes('2-4') || itemCommitment.includes('3-5') || itemCommitment.includes('3-4'))) {
      availabilityScore = 8;
    } else if (prefs.availability === 'high') {
      availabilityScore = 8;
    } else {
      availabilityScore = 4;
    }
  } else {
    availabilityScore = 5;
  }

  const rawTotal = causeScore + locationScore + roleScore + availabilityScore;
  return Math.min(Math.max(rawTotal, 12), 98);
}

export function isLocalMatch(item, prefs, chapters = []) {
  if (!prefs || !prefs.userLocation || !prefs.completed) return true;
  const userLoc = (typeof prefs.userLocation === 'string' ? prefs.userLocation : '').toLowerCase().trim();
  if (userLoc === 'remote / all locations' || userLoc === 'any' || !userLoc) return true;

  const itemLocation = (item?.targetLocation || item?.headquarters || '').toLowerCase();
  const locKeywords = userLoc.split(/[\s,&/]+/).filter(w => w && w.length > 2);
  
  const isDirect = locKeywords.some(kw => itemLocation.includes(kw)) || itemLocation.includes('remote');
  if (isDirect) return true;

  const orgId = item?.id || item?.orgId;
  if (orgId && Array.isArray(chapters)) {
    return chapters.some(c => 
      c.orgId === orgId && locKeywords.some(kw => 
        (c.location || '').toLowerCase().includes(kw) ||
        (c.institution || '').toLowerCase().includes(kw) ||
        (c.name || '').toLowerCase().includes(kw)
      )
    );
  }

  return false;
}
