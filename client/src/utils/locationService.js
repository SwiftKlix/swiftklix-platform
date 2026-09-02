import { US_CITIES } from './usCities.js';

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
  if (!query || query.trim().length < 1) return [];
  const cleanQ = query.trim().toLowerCase();

  const exactPrefixMatches = [];
  const wordPrefixMatches = [];
  const containsMatches = [];

  for (const city of US_CITIES) {
    const lower = city.toLowerCase();
    const cityNameOnly = lower.split(',')[0].trim();
    if (cityNameOnly.startsWith(cleanQ)) {
      exactPrefixMatches.push(city);
    } else if (lower.startsWith(cleanQ) || lower.split(' ').some(w => w.startsWith(cleanQ))) {
      wordPrefixMatches.push(city);
    } else if (lower.includes(cleanQ)) {
      containsMatches.push(city);
    }
  }

  const localRanked = [...exactPrefixMatches, ...wordPrefixMatches, ...containsMatches].slice(0, 8).map(city => ({
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
  // Method 1: True Hardware GPS / Wi-Fi Geolocation (7s window to acquire true local coordinates)
  if (typeof navigator !== 'undefined' && navigator.geolocation) {
    try {
      const coords = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          pos => resolve(pos.coords),
          err => reject(err),
          { timeout: 7000, enableHighAccuracy: true, maximumAge: 0 }
        );
      });

      if (coords && coords.latitude && coords.longitude) {
        // BigDataCloud Client-side municipal resolver (Highest accuracy for sub-metro cities like Redlands)
        try {
          const resBdc = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=en`
          );
          if (resBdc.ok) {
            const dataBdc = await resBdc.json();
            const city = dataBdc.locality || dataBdc.city || dataBdc.principalSubdivision;
            const stateCode = dataBdc.principalSubdivisionCode ? dataBdc.principalSubdivisionCode.replace('US-', '') : getStateCode(dataBdc.principalSubdivision);
            if (city && stateCode && !city.includes('undefined')) {
              return `${city}, ${stateCode}`;
            }
          }
        } catch (eBdc) {}

        // Nominatim reverse lookup
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json&addressdetails=1`,
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
        } catch (eNom) {}
      }
    } catch (e) {}
  }

  // Method 2: Network IP Fallback
  const providers = [
    async () => {
      const res = await fetch('https://ipwho.is/');
      if (!res.ok) throw new Error();
      const d = await res.json();
      if (d && d.success !== false && d.city && d.region_code) {
        return `${d.city}, ${d.region_code}`;
      }
      throw new Error();
    },
    async () => {
      const res = await fetch('https://freeipapi.com/api/json');
      if (!res.ok) throw new Error();
      const d = await res.json();
      if (d && d.cityName && d.regionCode) {
        return `${d.cityName}, ${d.regionCode}`;
      }
      throw new Error();
    }
  ];

  for (const p of providers) {
    try {
      const loc = await p();
      if (loc && !loc.includes('undefined')) {
        return loc;
      }
    } catch (e) {}
  }

  throw new Error("Could not detect your exact location. Please type your city name.");
}
