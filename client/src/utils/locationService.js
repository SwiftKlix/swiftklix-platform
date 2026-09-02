import { US_CITIES } from './usCities';

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

export async function searchUSPlaces(query) {
  if (!query || query.trim().length < 2) return [];
  const cleanQ = query.trim().toLowerCase();

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

  const localRanked = [...prefixMatches, ...containsMatches].slice(0, 8).map(city => ({
    display_name: city,
    city: city.split(',')[0].trim(),
    state: city.split(',')[1]?.trim() || ''
  }));

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1800);
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

      const merged = [...localRanked];
      for (const item of onlineMatches) {
        if (!merged.some(m => m.display_name.toLowerCase() === item.display_name.toLowerCase())) {
          merged.push(item);
        }
      }
      return merged.slice(0, 8);
    }
  } catch (e) {}

  return localRanked;
}

export async function detectPreciseLocation() {
  // Method 1: HTML5 High-Accuracy Geolocation (Fast 3.5s timeout)
  if (navigator.geolocation) {
    try {
      const coords = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          pos => resolve(pos.coords),
          err => reject(err),
          { timeout: 3500, enableHighAccuracy: true, maximumAge: 0 }
        );
      });

      const { latitude, longitude } = coords;

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
    } catch (geoErr) {}
  }

  // Method 2: High-speed IP Network Geolocation
  const ipSources = [
    async () => {
      const r = await fetch('https://ipapi.co/json/');
      if (!r.ok) throw new Error();
      const d = await r.json();
      if (d.city && (d.region_code || d.region)) {
        return `${d.city}, ${d.region_code || getStateCode(d.region)}`;
      }
      throw new Error();
    },
    async () => {
      const r = await fetch('https://ipwho.is/');
      if (!r.ok) throw new Error();
      const d = await r.json();
      if (d.city && (d.region_code || d.region)) {
        return `${d.city}, ${d.region_code || getStateCode(d.region)}`;
      }
      throw new Error();
    }
  ];

  for (const source of ipSources) {
    try {
      const loc = await source();
      if (loc) return loc;
    } catch (e) {}
  }

  throw new Error("Could not detect your location. Please type your city name in the search box.");
}
