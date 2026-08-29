/**
 * Reverse Geocoding Service
 * Maps latitude/longitude to Indian State, District, Taluk/Tehsil, and Village.
 * Uses public OpenStreetMap Nominatim with fallback to nearest Indian District catalog.
 */

import { ALL_INDIAN_STATES, DistrictAdminItem } from '../data/indiaAdminData';

export interface GeocodedLocationResult {
  state: string;
  district: string;
  taluka?: string;
  village?: string;
  formattedAddress?: string;
  source: 'NOMINATIM_OSM' | 'NEAREST_CATALOG_DISTRICT';
}

export async function reverseGeocodeCoordinates(
  latitude: number,
  longitude: number
): Promise<GeocodedLocationResult> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude.toFixed(5)}&lon=${longitude.toFixed(5)}&addressdetails=1&zoom=14`;
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept-Language': 'en-IN,en;q=0.9',
        'User-Agent': 'FARMFIT-Decision-Support-System/1.0'
      }
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};

      const state = addr.state || addr.state_district || '';
      const district = addr.state_district || addr.county || addr.district || addr.city || '';
      const taluka = addr.subdistrict || addr.county || addr.municipality || addr.taluk || '';
      const village = addr.village || addr.hamlet || addr.suburb || addr.neighbourhood || addr.town || '';

      return {
        state,
        district: cleanDistrictName(district),
        taluka,
        village,
        formattedAddress: data.display_name,
        source: 'NOMINATIM_OSM'
      };
    }
  } catch {
    // Network / timeout / CORS error fallback to closest district
  }

  // Fallback: Calculate nearest district using Euclidean distance on Indian districts
  return findNearestDistrictInCatalog(latitude, longitude);
}

function cleanDistrictName(name: string): string {
  return name.replace(/\s+District$/i, '').replace(/\s+district$/i, '').trim();
}

function findNearestDistrictInCatalog(lat: number, lng: number): GeocodedLocationResult {
  let minDistance = Infinity;
  let bestDistrict: DistrictAdminItem | null = null;
  let bestState = '';

  for (const st of ALL_INDIAN_STATES) {
    for (const dist of st.districts) {
      const dLat = dist.latitude - lat;
      const dLng = dist.longitude - lng;
      const distSq = dLat * dLat + dLng * dLng;
      if (distSq < minDistance) {
        minDistance = distSq;
        bestDistrict = dist;
        bestState = st.name;
      }
    }
  }

  if (bestDistrict) {
    return {
      state: bestState,
      district: bestDistrict.name,
      taluka: bestDistrict.taluks && bestDistrict.taluks.length > 0 ? bestDistrict.taluks[0] : undefined,
      village: undefined,
      formattedAddress: `${bestDistrict.name}, ${bestState}, India`,
      source: 'NEAREST_CATALOG_DISTRICT'
    };
  }

  return {
    state: '',
    district: '',
    taluka: '',
    village: '',
    source: 'NEAREST_CATALOG_DISTRICT'
  };
}
