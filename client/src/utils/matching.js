/**
 * Advanced Multi-Factor Compatibility Matching Engine for SwiftKlix
 * 
 * Weighted Criteria:
 * - Cause & Mission Match: 45% (Direct category + Semantic keyword taxonomy)
 * - Location & Chapter Proximity: 35% (Local chapter, Municipal, Regional, or Remote)
 * - Role & Opportunity Intent: 12% (Chapter Director vs Committee Member vs Core Team)
 * - Availability & Bandwidth: 8% (Weekly hours commitment)
 */

const CAUSE_TAXONOMY = {
  'education & youth': ['education', 'youth', 'tutoring', 'teaching', 'school', 'mentor', 'mentoring', 'curriculum', 'literacy', 'stem', 'college', 'student', 'academic'],
  'environment': ['environment', 'climate', 'tree', 'reforestation', 'conservation', 'sustainability', 'energy', 'clean water', 'waste', 'ocean', 'wildlife', 'green', 'eco', 'earth'],
  'tech & coding': ['tech', 'technology', 'coding', 'programming', 'software', 'developer', 'web', 'ai', 'robotics', 'hackathon', 'data', 'computer', 'stem'],
  'mental health': ['mental health', 'wellness', 'mind', 'counseling', 'peer support', 'mindfulness', 'therapy', 'stress', 'crisis', 'emotional', 'wellbeing'],
  'food security': ['food', 'hunger', 'pantry', 'meals', 'nutrition', 'agriculture', 'food bank', 'groceries', 'feeding', 'harvest'],
  'healthcare': ['health', 'healthcare', 'medical', 'medicine', 'clinical', 'nursing', 'public health', 'first aid', 'hospital', 'patient', 'doctor'],
  'civic & policy': ['civic', 'policy', 'democracy', 'voting', 'community advocacy', 'government', 'public service', 'organizing', 'rights', 'legislation'],
  'animal welfare': ['animal', 'pets', 'dog', 'cat', 'rescue', 'shelter', 'wildlife', 'veterinary', 'adoption', 'spay'],
  'arts & culture': ['arts', 'culture', 'music', 'creative', 'theatre', 'film', 'design', 'museum', 'expression', 'heritage'],
  'housing & relief': ['housing', 'homelessness', 'shelter', 'relief', 'disaster', 'humanitarian', 'refugee', 'emergency'],
  'human rights': ['human rights', 'justice', 'equality', 'advocacy', 'inclusion', 'diversity', 'equity', 'civil rights'],
  'economic empowerment': ['economic', 'finance', 'business', 'entrepreneurship', 'jobs', 'career', 'financial literacy', 'small business', 'microfinance']
};

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
    let bestCauseOverlap = 0;

    for (const selectedCause of prefs.causes) {
      const cleanSelected = (selectedCause || '').trim().toLowerCase();
      
      // Direct category string match
      if (itemCategory === cleanSelected || itemCategory.includes(cleanSelected) || cleanSelected.includes(itemCategory)) {
        bestCauseOverlap = Math.max(bestCauseOverlap, 45);
        break;
      }

      // Semantic taxonomy expansion match
      const taxonomyWords = CAUSE_TAXONOMY[cleanSelected] || [cleanSelected];
      const itemText = `${itemCategory} ${item?.title || ''} ${item?.focusArea || ''} ${item?.tagline || ''}`.toLowerCase();
      
      const matchedTaxonomy = taxonomyWords.filter(word => itemText.includes(word));
      if (matchedTaxonomy.length >= 2) {
        bestCauseOverlap = Math.max(bestCauseOverlap, 42);
      } else if (matchedTaxonomy.length === 1) {
        bestCauseOverlap = Math.max(bestCauseOverlap, 30);
      }
    }

    causeScore = bestCauseOverlap > 0 ? bestCauseOverlap : 6;
  } else {
    causeScore = 24; // Neutral baseline
  }

  // 2. Location & Chapter Proximity (0 to 35 pts)
  if (!userLoc || userLoc === 'remote / all locations' || userLoc === 'any') {
    locationScore = 26; // Open nationwide baseline
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
      locationScore = 35; // Local chapter established or municipal match
    } else if (itemLocation.includes('remote') || itemLocation.includes('all locations')) {
      locationScore = 24; // Accessible remote
    } else {
      // Check state-level proximity
      const userState = userLoc.split(',')[1]?.trim();
      const itemState = itemLocation.split(',')[1]?.trim();
      if (userState && itemState && userState.toLowerCase() === itemState.toLowerCase()) {
        locationScore = 18; // Regional in same state
      } else if (prefs.onlyLocal) {
        locationScore = 0; // Filtered out by strict local filter
      } else {
        locationScore = 6;
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
      roleScore = 5;
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
      availabilityScore = 5;
    }
  } else {
    availabilityScore = 6;
  }

  const rawTotal = causeScore + locationScore + roleScore + availabilityScore;
  return Math.min(Math.max(rawTotal, 14), 98);
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

export function getMatchBreakdown(item, prefs, chapters = []) {
  const score = calculateMatchScore(item, prefs, chapters);
  if (!score) return null;

  const userLoc = (typeof prefs?.userLocation === 'string' ? prefs.userLocation : '').trim();
  const itemCategory = (item?.category || '').trim();
  const highlights = [];

  if (prefs?.causes?.some(c => c.toLowerCase() === itemCategory.toLowerCase())) {
    highlights.push(`Direct Cause Match: ${itemCategory}`);
  }

  const orgId = item?.id || item?.orgId;
  const hasLocal = orgId && userLoc && Array.isArray(chapters) && chapters.some(c => 
    c.orgId === orgId && userLoc.toLowerCase().split(/[\s,]+/)[0] && (c.location || '').toLowerCase().includes(userLoc.toLowerCase().split(/[\s,]+/)[0])
  );

  if (hasLocal) {
    highlights.push(`Active Local Chapter in ${userLoc}`);
  }

  return {
    score,
    isTopMatch: score >= 85,
    highlights
  };
}
