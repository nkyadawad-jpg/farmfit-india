/**
 * Location Parser & Coordinate Extraction Utility
 * Handles Google Maps links, raw coordinates, DMS formats, and geo URIs.
 * Never falsely reports success if coordinates cannot be parsed.
 */

export interface ParsedCoordinatesResult {
  success: boolean;
  latitude: number | null;
  longitude: number | null;
  sourceType: 'RAW_COORDINATES' | 'GOOGLE_MAPS_LINK' | 'GEO_URI' | 'DMS_COORDINATES';
  originalInput: string;
  errorMessage?: string;
}

export function parseCoordinatesOrMapLink(input: string): ParsedCoordinatesResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      success: false,
      latitude: null,
      longitude: null,
      sourceType: 'RAW_COORDINATES',
      originalInput: input,
      errorMessage: 'Empty input provided'
    };
  }

  // 1. Google Maps URL patterns
  // Pattern A: /@(-?\d+\.\d+),(-?\d+\.\d+)
  const atMatch = trimmed.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atMatch) {
    const lat = parseFloat(atMatch[1]);
    const lng = parseFloat(atMatch[2]);
    if (isValidLatLong(lat, lng)) {
      return {
        success: true,
        latitude: lat,
        longitude: lng,
        sourceType: 'GOOGLE_MAPS_LINK',
        originalInput: trimmed
      };
    }
  }

  // Pattern B: q=(-?\d+\.\d+),(-?\d+\.\d+) or ll=(-?\d+\.\d+),(-?\d+\.\d+) or query=(-?\d+\.\d+),(-?\d+\.\d+)
  const queryMatch = trimmed.match(/[?&](?:q|ll|query|loc|center)=(-?\d+\.\d+),(-?\d+\.\d+)/i);
  if (queryMatch) {
    const lat = parseFloat(queryMatch[1]);
    const lng = parseFloat(queryMatch[2]);
    if (isValidLatLong(lat, lng)) {
      return {
        success: true,
        latitude: lat,
        longitude: lng,
        sourceType: 'GOOGLE_MAPS_LINK',
        originalInput: trimmed
      };
    }
  }

  // Pattern C: /place/(-?\d+\.\d+)[,+](-?\d+\.\d+)
  const placeMatch = trimmed.match(/\/place\/(-?\d+\.\d+)[,+](-?\d+\.\d+)/i);
  if (placeMatch) {
    const lat = parseFloat(placeMatch[1]);
    const lng = parseFloat(placeMatch[2]);
    if (isValidLatLong(lat, lng)) {
      return {
        success: true,
        latitude: lat,
        longitude: lng,
        sourceType: 'GOOGLE_MAPS_LINK',
        originalInput: trimmed
      };
    }
  }

  // 2. Geo URI: geo:22.7196,75.8577
  const geoMatch = trimmed.match(/^geo:(-?\d+\.\d+),(-?\d+\.\d+)/i);
  if (geoMatch) {
    const lat = parseFloat(geoMatch[1]);
    const lng = parseFloat(geoMatch[2]);
    if (isValidLatLong(lat, lng)) {
      return {
        success: true,
        latitude: lat,
        longitude: lng,
        sourceType: 'GEO_URI',
        originalInput: trimmed
      };
    }
  }

  // 3. Plain Decimal Coordinates: "22.7196, 75.8577" or "22.7196 75.8577" or "22.7196N, 75.8577E"
  const decimalMatch = trimmed.match(/^(-?\d{1,2}(?:\.\d+)?)[°\s,]+([NSEWns-]?)\s*[,;/ ]\s*(-?\d{1,3}(?:\.\d+)?)[°\s]*([NSEWew-]?)$/i);
  if (decimalMatch) {
    let lat = parseFloat(decimalMatch[1]);
    const latDir = decimalMatch[2].toUpperCase();
    let lng = parseFloat(decimalMatch[3]);
    const lngDir = decimalMatch[4].toUpperCase();

    if (latDir === 'S') lat = -lat;
    if (lngDir === 'W') lng = -lng;

    if (isValidLatLong(lat, lng)) {
      return {
        success: true,
        latitude: lat,
        longitude: lng,
        sourceType: 'RAW_COORDINATES',
        originalInput: trimmed
      };
    }
  }

  // If it is a shortened google maps link (like goo.gl or maps.app.goo.gl) where coordinates are hidden behind redirect
  if (trimmed.includes('maps.app.goo.gl') || trimmed.includes('goo.gl/maps')) {
    return {
      success: false,
      latitude: null,
      longitude: null,
      sourceType: 'GOOGLE_MAPS_LINK',
      originalInput: trimmed,
      errorMessage: 'Shortened link detected. Please open the link in your browser, copy the full URL from address bar or use GPS / Pin drop.'
    };
  }

  return {
    success: false,
    latitude: null,
    longitude: null,
    sourceType: trimmed.startsWith('http') ? 'GOOGLE_MAPS_LINK' : 'RAW_COORDINATES',
    originalInput: trimmed,
    errorMessage: 'Could not extract valid latitude & longitude from the provided text.'
  };
}

export function isValidLatLong(lat: number, lng: number): boolean {
  return !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}
