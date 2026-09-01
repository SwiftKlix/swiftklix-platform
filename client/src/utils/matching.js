/**
 * Smart Location-First & Cause Compatibility Matching Engine for SwiftKlix
 */

export function calculateMatchScore(item, prefs, chapters = []) {
  if (!prefs || !prefs.completed) return null;

  let score = 55; // Base compatibility

  const itemCategory = item?.category || '';
  const itemRole = item?.role || item?.type || item?.title || '';
  const itemLocation = (item?.targetLocation || item?.headquarters || '').toLowerCase();
  const itemCommitment = (item?.commitment || '').toLowerCase();
  const userLoc = (typeof prefs.userLocation === 'string' ? prefs.userLocation : '').toLowerCase().trim();

  // 1. Check if this Org has an active chapter in user's city/campus
  let hasLocalChapter = false;
  if (userLoc && userLoc !== 'remote / all locations' && userLoc !== 'any') {
    const locKeywords = userLoc.split(/[\s,&/]+/).filter(w => w && w.length > 2);
    
    // Check direct location keywords
    const isDirectLocation = locKeywords.some(kw => itemLocation.includes(kw));
    
    // Check chapter database
    const orgId = item?.id || item?.orgId;
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
      score += 28; // Major local boost
    } else if (itemLocation.includes('remote')) {
      score += 18;
    } else if (prefs.onlyLocal) {
      score -= 15;
    } else {
      score += 8;
    }
  } else {
    score += 15;
  }

  // 2. Cause Affinity (+25% max)
  if (prefs.causes && Array.isArray(prefs.causes) && prefs.causes.length > 0) {
    const directMatch = prefs.causes.some(c => 
      c && (
        itemCategory.toLowerCase().includes(c.toLowerCase()) || 
        c.toLowerCase().includes(itemCategory.toLowerCase())
      )
    );
    if (directMatch) {
      score += 22;
    } else {
      score += 6;
    }
  }

  // 3. Role Preference (+12% max)
  if (prefs.roleType) {
    if (prefs.roleType === 'branch' && (itemRole.toLowerCase().includes('branch') || itemRole.toLowerCase().includes('lead') || itemRole.toLowerCase().includes('chapter') || itemRole.toLowerCase().includes('founding'))) {
      score += 12;
    } else if (prefs.roleType === 'volunteer' && (itemRole.toLowerCase().includes('position') || itemRole.toLowerCase().includes('volunteer') || itemRole.toLowerCase().includes('coordinator') || itemRole.toLowerCase().includes('instructor'))) {
      score += 12;
    } else {
      score += 8;
    }
  }

  // 4. Availability / Commitment (+10% max)
  if (prefs.availability) {
    if (prefs.availability === 'low' && (itemCommitment.includes('1-2') || itemCommitment.includes('flexible') || itemCommitment.includes('2-3'))) {
      score += 10;
    } else if (prefs.availability === 'medium' && (itemCommitment.includes('3-4') || itemCommitment.includes('3-5') || itemCommitment.includes('2-4'))) {
      score += 10;
    } else if (prefs.availability === 'high') {
      score += 10;
    } else {
      score += 5;
    }
  }

  // Clamp score between 68% and 99%
  return Math.min(Math.max(score, 68), 99);
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
