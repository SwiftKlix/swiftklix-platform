import { US_CITIES } from './usCities';

// State name to 2-letter postal code map
const STATE_MAP = {
  'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR', 'california': 'CA',
  'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE', 'florida': 'FL', 'georgia': 'GA',
  'hawaii': 'HI', 'idaho': 'ID', 'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA',
  'kansas': 'KS', 'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD',
  'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS', 'missouri': 'MO',
  'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV', 'new hampshire': 'NH', 'new jersey': 'NJ',
  'new mexico': 'NM', 'new york': 'NY', 'north carolina': 'NC', 'north dakota': 'ND', 'ohio': 'OH',
  'oklahoma': 'OK', 'oregon': 'OR', 'pennsylvania': 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
  'south dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT', 'vermont': 'VT',
  'virginia': 'VA', 'washington': 'WA', 'west virginia': 'WV', 'wisconsin': 'WI', 'wyoming': 'WY',
  'district of columbia': 'DC', 'puerto rico': 'PR'
};

export function getStateCode(stateName) {
  if (!stateName) return '';
  const clean = stateName.trim().toLowerCase();
  if (STATE_MAP[clean]) return STATE_MAP[clean];
  if (stateName.length === 2) return stateName.toUpperCase();
  return stateName;
}

// Real-time US Places Search (Precision ranked autocomplete)
export async function searchUSPlaces(query) {
  if (!query || query.trim().length < 2) return [];
  const cleanQ = query.trim().toLowerCase();

  // 1. Instant local matching with priority ranking
  const prefixMatches = [];
  const containsMatches = [];

  for (const city of US_CITIES) {
    const lower = city.toLowerCase();
    const cityNameOnly = lower.split(',')[0].trim();
    if (cityNameOnly.startsWith(cleanQ) || lower.startsWith(cleanQ)) {
      prefixMatches.push(city);
    } else if (lower.includes(cleanQ)) {
      containsMatches.push(city);
    }
  }

  const localRanked = [...prefixMatches, ...containsMatches].slice(0, 7).map(city => ({
    display_name: city,
    city: city.split(',')[0].trim(),
    state: city.split(',')[1]?.trim() || ''
  }));

  // 2. Query Nominatim for small towns, campuses, and metro subdivisions
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2200);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&countrycodes=us&format=json&addressdetails=1&limit=6`,
      {
        signal: controller.signal,
        headers: { 'Accept-Language': 'en-US,en;q=0.9' }
      }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const onlineMatches = data.map(item => {
        const addr = item.address || {};
        const city = addr.city || addr.town || addr.village || addr.municipality || addr.suburb || addr.neighbourhood || addr.county || item.name;
        const state = addr.state || '';
        const stateCode = getStateCode(state);
        const formatted = stateCode ? `${city}, ${stateCode}` : `${city}, ${state}`;
        return {
          display_name: formatted,
          city,
          state: stateCode || state
        };
      }).filter(item => Boolean(item.city));

      // Merge and deduplicate
      const merged = [...localRanked];
      for (const item of onlineMatches) {
        if (!merged.some(m => m.display_name.toLowerCase() === item.display_name.toLowerCase())) {
          merged.push(item);
        }
      }
      return merged.slice(0, 8);
    }
  } catch (e) {
    // Return local matches if offline
  }

  return localRanked;
}

// 1-Click High-Precision GPS Location Detector (Zero Mock Fallbacks)
export async function detectPreciseLocation() {
  // Method 1: HTML5 High-Accuracy Geolocation -> Reverse Geocode
  if (navigator.geolocation) {
    try {
      const coords = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          pos => resolve(pos.coords),
          err => reject(err),
          { timeout: 9000, enableHighAccuracy: true, maximumAge: 0 }
        );
      });

      const { latitude, longitude } = coords;

      // 1A. Nominatim High-Accuracy Reverse Geocode
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
          { headers: { 'Accept-Language': 'en-US,en;q=0.9' } }
        );
        if (res.ok) {
          const data = await res.json();
          const addr = data.address || {};
          const city = addr.city || addr.town || addr.village || addr.municipality || addr.suburb || addr.neighbourhood || addr.county;
          const stateCode = getStateCode(addr.state);
          if (city && stateCode) {
            return `${city}, ${stateCode}`;
          }
        }
      } catch (err1) {}

      // 1B. BigDataCloud Fallback
      try {
        const res2 = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        if (res2.ok) {
          const data2 = await res2.json();
          const city = data2.city || data2.locality || data2.principalSubdivision;
          const stateCode = data2.principalSubdivisionCode ? data2.principalSubdivisionCode.replace('US-', '') : getStateCode(data2.principalSubdivision);
          if (city && stateCode) {
            return `${city}, ${stateCode}`;
          }
        }
      } catch (err2) {}
    } catch (geoErr) {
      // Browser permission denied or timed out, proceed to IP-based detection
    }
  }

  // Method 2: IP-based Network Geolocation Fallback
  try {
    const ipRes = await fetch('https://ipapi.co/json/');
    if (ipRes.ok) {
      const ipData = await ipRes.json();
      if (ipData.city && (ipData.region_code || ipData.region)) {
        const stateCode = ipData.region_code || getStateCode(ipData.region);
        return `${ipData.city}, ${stateCode}`;
      }
    }
  } catch (ipErr) {}

  try {
    const ipRes2 = await fetch('https://ipwho.is/');
    if (ipRes2.ok) {
      const ipData2 = await ipRes2.json();
      if (ipData2.city && (ipData2.region_code || ipData2.region)) {
        const stateCode = ipData2.region_code || getStateCode(ipData2.region);
        return `${ipData2.city}, ${stateCode}`;
      }
    }
  } catch (ipErr2) {}

  throw new Error("Could not detect your exact location. Please type your city name in the search box.");
}
