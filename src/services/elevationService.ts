/**
 * Public Free Elevation & Altitude Service
 * Fetches real elevation from open public datasets (e.g. Open-Meteo Free Elevation API)
 * NEVER invents elevation. If unavailable or invalid, returns null with status 'UNAVAILABLE'.
 */

export interface ElevationResult {
  elevationMeters: number | null;
  elevationFeet: number | null;
  status: 'OBTAINED' | 'UNAVAILABLE' | 'FETCHING';
  sourceName: string;
  errorMessage?: string;
}

const elevationCache = new Map<string, number>();

export async function fetchPublicElevation(
  latitude: number,
  longitude: number
): Promise<ElevationResult> {
  if (isNaN(latitude) || isNaN(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return {
      elevationMeters: null,
      elevationFeet: null,
      status: 'UNAVAILABLE',
      sourceName: 'Open-Meteo Free Elevation Dataset',
      errorMessage: 'Invalid GPS coordinates provided.'
    };
  }

  const cacheKey = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
  if (elevationCache.has(cacheKey)) {
    const cachedMeters = elevationCache.get(cacheKey)!;
    return {
      elevationMeters: cachedMeters,
      elevationFeet: Math.round(cachedMeters * 3.28084),
      status: 'OBTAINED',
      sourceName: 'Open-Meteo Free Elevation Dataset (Cached)'
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const url = `https://api.open-meteo.com/v1/elevation?latitude=${latitude.toFixed(5)}&longitude=${longitude.toFixed(5)}`;
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        elevationMeters: null,
        elevationFeet: null,
        status: 'UNAVAILABLE',
        sourceName: 'Open-Meteo Free Elevation Dataset',
        errorMessage: `Service returned HTTP ${response.status}`
      };
    }

    const data = await response.json();
    if (data && Array.isArray(data.elevation) && data.elevation.length > 0 && typeof data.elevation[0] === 'number') {
      const elevationMeters = Math.round(data.elevation[0]);
      elevationCache.set(cacheKey, elevationMeters);

      return {
        elevationMeters,
        elevationFeet: Math.round(elevationMeters * 3.28084),
        status: 'OBTAINED',
        sourceName: 'Open-Meteo Free Elevation Dataset (SRTM / Copernicus DEM)'
      };
    }

    return {
      elevationMeters: null,
      elevationFeet: null,
      status: 'UNAVAILABLE',
      sourceName: 'Open-Meteo Free Elevation Dataset'
    };
  } catch (error) {
    return {
      elevationMeters: null,
      elevationFeet: null,
      status: 'UNAVAILABLE',
      sourceName: 'Open-Meteo Free Elevation Dataset',
      errorMessage: error instanceof Error ? error.message : 'Network failure or timeout'
    };
  }
}
