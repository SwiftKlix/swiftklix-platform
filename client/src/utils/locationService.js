import { US_CITIES } from './usCities';

// Real-time US Places Search (Google Maps style autocomplete)
export async function searchUSPlaces(query) {
  if (!query || query.trim().length < 2) return [];
  const cleanQ = query.trim().toLowerCase();

  // 1. Instant local matching across 775+ US cities & college hubs
  const localMatches = US_CITIES.filter(city =>
    city.toLowerCase().includes(cleanQ)
  ).slice(0, 6).map(city => ({
    display_name: city,
    city: city.split(',')[0].trim(),
    state: city.split(',')[1]?.trim() || ''
  }));

  // 2. Fetch live OpenStreetMap / Nominatim US Places search for any small town or campus
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&countrycodes=us&format=json&addressdetails=1&limit=6`,
      {
        signal: controller.signal,
        headers: {
          'Accept-Language': 'en-US,en;q=0.9'
        }
      }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const onlineMatches = data.map(item => {
        const addr = item.address || {};
        const city = addr.city || addr.town || addr.village || addr.municipality || addr.county || item.name;
        const state = addr.state || '';
        const stateCode = getStateCode(state);
        const formatted = stateCode ? `${city}, ${stateCode}` : `${city}, ${state}`;
        return {
          display_name: formatted,
          city,
          state: stateCode || state
        };
      }).filter(item => Boolean(item.city));

      // Merge online matches with local matches, deduplicating by display_name
      const merged = [...localMatches];
      for (const item of onlineMatches) {
        if (!merged.some(m => m.display_name.toLowerCase() === item.display_name.toLowerCase())) {
          merged.push(item);
        }
      }
      return merged.slice(0, 8);
    }
  } catch (e) {
    // Return local matches if offline or timed out
  }

  return localMatches;
}

// 1-Click Precise GPS Location Detector (Google Maps style)
export async function detectPreciseLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          // Reverse geocode via BigDataCloud client-side free reverse geocoder
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          if (res.ok) {
            const data = await res.json();
            const city = data.city || data.locality || data.principalSubdivision;
            const state = data.principalSubdivisionCode ? data.principalSubdivisionCode.replace('US-', '') : data.principalSubdivision;
            const result = `${city}, ${state}`;
            resolve(result);
            return;
          }
        } catch (e) {
          // Fallback to Nominatim reverse geocode
          try {
            const res2 = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`
            );
            if (res2.ok) {
              const data2 = await res2.json();
              const addr = data2.address || {};
              const city = addr.city || addr.town || addr.village || addr.county || 'Local Area';
              const state = getStateCode(addr.state) || addr.state || '';
              resolve(`${city}, ${state}`);
              return;
            }
          } catch (err2) {}
        }
        resolve("Austin, TX"); // fallback
      },
      (err) => {
        reject(err);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  });
}

function getStateCode(stateName) {
  if (!stateName) return '';
  const states = {
    'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR', 'California': 'CA',
    'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 'Florida': 'FL', 'Georgia': 'GA',
    'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA',
    'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
    'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS', 'Missouri': 'MO',
    'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ',
    'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH',
    'Oklahoma': 'OK', 'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
    'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT',
    'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY',
    'District of Columbia': 'DC', 'Puerto Rico': 'PR'
  };
  return states[stateName] || (stateName.length === 2 ? stateName.toUpperCase() : stateName);
}
