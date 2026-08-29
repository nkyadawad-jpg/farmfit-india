import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Link as LinkIcon, 
  Compass, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Mountain, 
  Globe, 
  RefreshCw,
  FileCheck,
  Info
} from 'lucide-react';
import { FarmLocation, Language } from '../../types';
import { ALL_INDIAN_STATES, getDistrictsByState } from '../../data/indiaAdminData';
import { AGRO_CLIMATIC_ZONES } from '../../data/officialData';
import { parseCoordinatesOrMapLink } from '../../services/locationParser';
import { fetchPublicElevation } from '../../services/elevationService';
import { reverseGeocodeCoordinates } from '../../services/reverseGeocoding';
import { InteractiveMapPicker } from './InteractiveMapPicker';

interface LocationEngineProps {
  location: FarmLocation;
  onChange: (location: FarmLocation) => void;
  language: Language;
}

export const LocationEngine: React.FC<LocationEngineProps> = ({
  location,
  onChange,
  language
}) => {
  // Method selection: 1. GPS, 2. Manual Coordinates, 3. Google Maps Link, 4. Map Pin
  const [activeMethod, setActiveMethod] = useState<'gps' | 'manual' | 'link' | 'map'>('gps');
  
  // Geolocation states
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'locating' | 'success' | 'error'>('idle');
  const [gpsMessage, setGpsMessage] = useState('');

  // Manual coordinate inputs & validation
  const [manualLat, setManualLat] = useState<string>(location.latitude ? location.latitude.toString() : '');
  const [manualLng, setManualLng] = useState<string>(location.longitude ? location.longitude.toString() : '');
  const [manualError, setManualError] = useState<string>('');
  const [manualSuccess, setManualSuccess] = useState<boolean>(false);

  // Google Maps link states
  const [googleMapsUrl, setGoogleMapsUrl] = useState<string>('');
  const [linkStatus, setLinkStatus] = useState<'idle' | 'extracting' | 'success' | 'error'>('idle');
  const [linkMessage, setLinkMessage] = useState<string>('');

  // Elevation state
  const [isElevationLoading, setIsElevationLoading] = useState(false);

  // States and districts for administrative architecture
  const states = ALL_INDIAN_STATES.map((s) => s.name).sort();
  const currentDistricts = location.state ? getDistrictsByState(location.state) : [];
  const currentDistrictObj = location.district ? (currentDistricts.find((d) => d.name.toLowerCase() === location.district.toLowerCase()) || currentDistricts[0]) : undefined;
  const currentZone = location.agroClimaticZoneId ? (AGRO_CLIMATIC_ZONES.find((z) => z.id === location.agroClimaticZoneId) || AGRO_CLIMATIC_ZONES[7]) : undefined;
  const availableTaluks = currentDistrictObj?.taluks || [];

  // Helper to fetch elevation safely
  const updateElevationAndHierarchy = async (lat: number, lng: number, sourceLabel: 'DEVICE_GPS' | 'MANUAL_COORDINATES' | 'GOOGLE_MAPS_LINK' | 'MAP_PIN') => {
    setIsElevationLoading(true);
    try {
      const geoResult = await reverseGeocodeCoordinates(lat, lng);
      const matchingDistrict = currentDistricts.find((d) => d.name.toLowerCase().includes((geoResult.district || '').toLowerCase())) || currentDistrictObj;
      const zone = AGRO_CLIMATIC_ZONES.find((z) => z.id === (matchingDistrict?.zoneId || 8)) || AGRO_CLIMATIC_ZONES[7];
      const elevRes = await fetchPublicElevation(lat, lng);

      onChange({
        ...location,
        latitude: lat,
        longitude: lng,
        state: geoResult.state || location.state,
        district: matchingDistrict ? matchingDistrict.name : geoResult.district || location.district,
        taluka: geoResult.taluka || location.taluka,
        village: geoResult.village || location.village,
        altitudeMeters: elevRes.elevationMeters,
        altitudeStatus: elevRes.status,
        altitudeSourceName: elevRes.sourceName,
        locationSource: sourceLabel,
        formattedAddress: geoResult.formattedAddress,
        agroClimaticZoneId: zone.id,
        agroClimaticZoneName: zone.name,
        normalAnnualRainfallMm: matchingDistrict ? matchingDistrict.normalRainfallMm : location.normalAnnualRainfallMm
      });
    } catch {
      onChange({
        ...location,
        latitude: lat,
        longitude: lng,
        altitudeMeters: null,
        altitudeStatus: 'UNAVAILABLE',
        altitudeSourceName: 'Elevation data unavailable',
        locationSource: sourceLabel
      });
    } finally {
      setIsElevationLoading(false);
    }
  };

  // -------------------------------------------------------------
  // METHOD 1: USE MY CURRENT LOCATION
  // -------------------------------------------------------------
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGpsStatus('error');
      setGpsMessage('Browser geolocation is not supported on this device/browser.');
      return;
    }

    setGpsStatus('locating');
    setGpsMessage('Requesting GPS sensor permission...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = Number(position.coords.latitude.toFixed(6));
        const lng = Number(position.coords.longitude.toFixed(6));
        setGpsStatus('success');
        setGpsMessage(`Location obtained successfully: ${lat}° N, ${lng}° E (Accuracy: ±${Math.round(position.coords.accuracy || 10)}m)`);
        setManualLat(lat.toString());
        setManualLng(lng.toString());

        await updateElevationAndHierarchy(lat, lng, 'DEVICE_GPS');
      },
      (error) => {
        setGpsStatus('error');
        if (error.code === error.PERMISSION_DENIED) {
          setGpsMessage('Location permission denied by user. Please allow location access or use coordinates/link.');
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setGpsMessage('GPS position unavailable. Please ensure location services are enabled on your device.');
        } else if (error.code === error.TIMEOUT) {
          setGpsMessage('Location request timed out. Please try again.');
        } else {
          setGpsMessage('Failed to obtain location: ' + error.message);
        }
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  // -------------------------------------------------------------
  // METHOD 2: ENTER LATITUDE AND LONGITUDE
  // -------------------------------------------------------------
  const handleApplyCoordinates = async () => {
    setManualError('');
    setManualSuccess(false);

    const lat = parseFloat(manualLat.trim());
    const lng = parseFloat(manualLng.trim());

    if (isNaN(lat) || isNaN(lng)) {
      setManualError('Please enter valid numeric values for both Latitude and Longitude.');
      return;
    }

    // Latitude range validation: -90 to +90
    if (lat < -90 || lat > 90) {
      setManualError('Invalid Latitude. Latitude must be between -90.0° and +90.0° (India is approximately 6.5° N to 37.5° N).');
      return;
    }

    // Longitude range validation: -180 to +180
    if (lng < -180 || lng > 180) {
      setManualError('Invalid Longitude. Longitude must be between -180.0° and +180.0° (India is approximately 68.0° E to 97.5° E).');
      return;
    }

    setManualSuccess(true);
    await updateElevationAndHierarchy(Number(lat.toFixed(6)), Number(lng.toFixed(6)), 'MANUAL_COORDINATES');
  };

  // -------------------------------------------------------------
  // METHOD 3: PASTE GOOGLE MAPS LINK
  // -------------------------------------------------------------
  const handleExtractFromGoogleMapsLink = async () => {
    setLinkMessage('');
    setLinkStatus('extracting');

    if (!googleMapsUrl.trim()) {
      setLinkStatus('error');
      setLinkMessage('Please paste a valid Google Maps URL or coordinate string.');
      return;
    }

    const parseResult = parseCoordinatesOrMapLink(googleMapsUrl);

    if (!parseResult.success || parseResult.latitude === null || parseResult.longitude === null) {
      setLinkStatus('error');
      setLinkMessage(
        parseResult.errorMessage ||
        'Coordinates could not be extracted from this link. Please enter coordinates manually or use current location.'
      );
      return;
    }

    const lat = parseResult.latitude;
    const lng = parseResult.longitude;

    setLinkStatus('success');
    setLinkMessage(`Coordinates extracted successfully: ${lat.toFixed(6)}° N, ${lng.toFixed(6)}° E`);
    setManualLat(lat.toString());
    setManualLng(lng.toString());

    await updateElevationAndHierarchy(lat, lng, 'GOOGLE_MAPS_LINK');
  };

  // Method 4 (Interactive Map Pin Drop)
  const handleMapPinSelected = async (lat: number, lng: number) => {
    setManualLat(lat.toString());
    setManualLng(lng.toString());
    await updateElevationAndHierarchy(lat, lng, 'MAP_PIN');
  };

  // Administrative Selectors
  const handleStateSelect = (newStateName: string) => {
    setManualLat('');
    setManualLng('');
    setManualSuccess(false);
    setManualError('');
    setGpsStatus('idle');
    setGpsMessage('');
    setLinkStatus('idle');
    setLinkMessage('');

    if (!newStateName) {
      onChange({
        ...location,
        state: '',
        district: '',
        taluka: '',
        village: '',
        latitude: null,
        longitude: null,
        agroClimaticZoneId: undefined,
        agroClimaticZoneName: undefined,
        normalAnnualRainfallMm: null,
        locationSource: 'NOT_SPECIFIED'
      });
      return;
    }

    // STATE CHANGE BEHAVIOR: Clear district, coordinates, zone and weather baseline.
    // User must explicitly choose a district from the new state's complete list.
    onChange({
      ...location,
      state: newStateName,
      district: '',
      taluka: '',
      village: '',
      latitude: null,
      longitude: null,
      agroClimaticZoneId: undefined,
      agroClimaticZoneName: undefined,
      normalAnnualRainfallMm: null,
      locationSource: 'NOT_SPECIFIED'
    });
  };

  const handleDistrictSelect = (newDistrictName: string) => {
    if (!newDistrictName) {
      onChange({
        ...location,
        district: '',
        taluka: '',
        village: '',
        latitude: null,
        longitude: null,
        agroClimaticZoneId: undefined,
        agroClimaticZoneName: undefined,
        normalAnnualRainfallMm: null,
        locationSource: 'NOT_SPECIFIED'
      });
      return;
    }

    const distObj = currentDistricts.find((d) => d.name.toLowerCase() === newDistrictName.toLowerCase());
    if (!distObj) return;

    const zone = AGRO_CLIMATIC_ZONES.find((z) => z.id === distObj.zoneId) || AGRO_CLIMATIC_ZONES[7];
    setManualLat(distObj.latitude.toString());
    setManualLng(distObj.longitude.toString());

    onChange({
      ...location,
      district: distObj.name,
      taluka: distObj.taluks && distObj.taluks.length > 0 ? distObj.taluks[0] : '',
      latitude: distObj.latitude,
      longitude: distObj.longitude,
      agroClimaticZoneId: zone.id,
      agroClimaticZoneName: zone.name,
      normalAnnualRainfallMm: distObj.normalRainfallMm,
      locationSource: 'CATALOG_DEFAULT'
    });
  };

  // Location Source Label & Badge
  const getLocationSourceTag = () => {
    if (!location.latitude || !location.longitude) {
      return {
        label: 'LOCATION UNAVAILABLE',
        variant: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'
      };
    }
    switch (location.locationSource) {
      case 'DEVICE_GPS':
        return {
          label: 'GPS VERIFIED',
          variant: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
        };
      case 'GOOGLE_MAPS_LINK':
      case 'MANUAL_COORDINATES':
      case 'MAP_PIN':
        return {
          label: 'USER SELECTED LOCATION',
          variant: 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800'
        };
      case 'CATALOG_DEFAULT':
      default:
        return {
          label: 'ADMINISTRATIVE DISTRICT COORDINATE',
          variant: 'bg-indigo-100 text-indigo-900 border-indigo-300 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800'
        };
    }
  };

  const getLocationStatusText = () => {
    if (!location.latitude || !location.longitude) {
      return 'Please select your State and District or acquire GPS coordinates';
    }
    switch (location.locationSource) {
      case 'DEVICE_GPS':
        return 'GPS Sensor coordinates verified with high accuracy';
      case 'GOOGLE_MAPS_LINK':
        return 'Coordinates extracted directly from Google Maps location';
      case 'MANUAL_COORDINATES':
        return 'Coordinates manually configured by user';
      case 'MAP_PIN':
        return 'Interactive map pin dropped by user';
      case 'CATALOG_DEFAULT':
      default:
        return `District administrative centroid (${location.district || 'District'}, ${location.state || 'State'})`;
    }
  };

  return (
    <div className="space-y-6" id="farm-location-engine">
      {/* 3 Locating Methods Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Locate Your Farm</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              {getLocationStatusText()}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${getLocationSourceTag().variant}`}>
              {getLocationSourceTag().label}
            </span>
          </div>
        </div>

        {/* 3 Method Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Method 1 Tab */}
          <button
            type="button"
            id="tab-method-gps"
            onClick={() => setActiveMethod('gps')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
              activeMethod === 'gps'
                ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
            }`}
          >
            <div className={`p-2 rounded-lg ${activeMethod === 'gps' ? 'bg-white/20 text-white' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'}`}>
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider">1. Use My Current Location</div>
              <div className={`text-[11px] ${activeMethod === 'gps' ? 'text-emerald-100' : 'text-slate-500 dark:text-slate-400'}`}>
                Browser GPS Geolocation
              </div>
            </div>
          </button>

          {/* Method 2 Tab */}
          <button
            type="button"
            id="tab-method-manual"
            onClick={() => setActiveMethod('manual')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
              activeMethod === 'manual'
                ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
            }`}
          >
            <div className={`p-2 rounded-lg ${activeMethod === 'manual' ? 'bg-white/20 text-white' : 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'}`}>
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider">2. Enter Latitude & Longitude</div>
              <div className={`text-[11px] ${activeMethod === 'manual' ? 'text-emerald-100' : 'text-slate-500 dark:text-slate-400'}`}>
                Validated coordinate inputs
              </div>
            </div>
          </button>

          {/* Method 3 Tab */}
          <button
            type="button"
            id="tab-method-link"
            onClick={() => setActiveMethod('link')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
              activeMethod === 'link'
                ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
            }`}
          >
            <div className={`p-2 rounded-lg ${activeMethod === 'link' ? 'bg-white/20 text-white' : 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300'}`}>
              <LinkIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider">3. Paste Google Maps Link</div>
              <div className={`text-[11px] ${activeMethod === 'link' ? 'text-emerald-100' : 'text-slate-500 dark:text-slate-400'}`}>
                URL parser & coordinate extractor
              </div>
            </div>
          </button>
        </div>

        {/* Tab Specific Panels */}
        <div className="mt-5 pt-5 border-t border-slate-200 dark:border-slate-800">
          {/* METHOD 1 CONTENT: USE MY CURRENT LOCATION */}
          {activeMethod === 'gps' && (
            <div className="space-y-4" id="section-method-1-gps">
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-emerald-600" />
                    <span>Method 1: Request Browser Geolocation</span>
                  </h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300">
                    Click the button below to request browser location permissions and retrieve your farm's exact latitude and longitude.
                  </p>
                </div>

                <button
                  type="button"
                  id="btn-use-current-location"
                  onClick={handleUseCurrentLocation}
                  disabled={gpsStatus === 'locating'}
                  className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50 transition-all uppercase tracking-wider"
                >
                  {gpsStatus === 'locating' ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Requesting Geolocation...</span>
                    </>
                  ) : (
                    <>
                      <Navigation className="w-4 h-4" />
                      <span>USE MY CURRENT LOCATION</span>
                    </>
                  )}
                </button>
              </div>

              {/* Status Alert for GPS */}
              {gpsStatus === 'locating' && (
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-600 shrink-0" />
                  <span>Waiting for browser location permission and GPS satellite lock...</span>
                </div>
              )}

              {gpsStatus === 'error' && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Location Permission / Access Status:</strong>
                    <span>{gpsMessage}</span>
                  </div>
                </div>
              )}

              {gpsStatus === 'success' && (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">{gpsMessage}</span>
                </div>
              )}
            </div>
          )}

          {/* METHOD 2 CONTENT: ENTER LATITUDE AND LONGITUDE */}
          {activeMethod === 'manual' && (
            <div className="space-y-4" id="section-method-2-manual">
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                <h4 className="text-sm font-bold text-blue-900 dark:text-blue-200 flex items-center gap-2 mb-1">
                  <Compass className="w-4 h-4 text-blue-600" />
                  <span>Method 2: Manual Coordinate Input with Range Validation</span>
                </h4>
                <p className="text-xs text-blue-800 dark:text-blue-300">
                  Enter your farm's decimal coordinates. Inputs are validated for proper decimal ranges.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Latitude (° N) <span className="text-slate-500 font-normal">(-90.0 to +90.0)</span>
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    id="input-manual-latitude"
                    value={manualLat}
                    onChange={(e) => {
                      setManualLat(e.target.value);
                      setManualError('');
                      setManualSuccess(false);
                    }}
                    placeholder="e.g. 22.719600"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Longitude (° E) <span className="text-slate-500 font-normal">(-180.0 to +180.0)</span>
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    id="input-manual-longitude"
                    value={manualLng}
                    onChange={(e) => {
                      setManualLng(e.target.value);
                      setManualError('');
                      setManualSuccess(false);
                    }}
                    placeholder="e.g. 75.857700"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              {manualError && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{manualError}</span>
                </div>
              )}

              {manualSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Coordinates validated and applied: {parseFloat(manualLat).toFixed(6)}° N, {parseFloat(manualLng).toFixed(6)}° E</span>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  id="btn-apply-coordinates"
                  onClick={handleApplyCoordinates}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm cursor-pointer uppercase tracking-wider transition-all"
                >
                  Validate & Apply Coordinates
                </button>
              </div>
            </div>
          )}

          {/* METHOD 3 CONTENT: PASTE GOOGLE MAPS LINK */}
          {activeMethod === 'link' && (
            <div className="space-y-4" id="section-method-3-link">
              <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800">
                <h4 className="text-sm font-bold text-teal-900 dark:text-teal-200 flex items-center gap-2 mb-1">
                  <LinkIcon className="w-4 h-4 text-teal-600" />
                  <span>Method 3: Paste Google Maps Farm Link or Share URL</span>
                </h4>
                <p className="text-xs text-teal-800 dark:text-teal-300">
                  Paste any Google Maps URL containing coordinates (e.g. from sharing a dropped pin or address).
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Google Maps URL / Coordinates String
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    id="input-google-maps-url"
                    value={googleMapsUrl}
                    onChange={(e) => {
                      setGoogleMapsUrl(e.target.value);
                      setLinkStatus('idle');
                      setLinkMessage('');
                    }}
                    placeholder="e.g. https://www.google.com/maps/@22.7196,75.8577,15z or https://maps.google.com/?q=22.7196,75.8577"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    id="btn-extract-maps-link"
                    onClick={handleExtractFromGoogleMapsLink}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm shrink-0 cursor-pointer uppercase tracking-wider"
                  >
                    Extract Coordinates
                  </button>
                </div>
              </div>

              {linkStatus === 'error' && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Extraction Notice:</strong>
                    <span>{linkMessage}</span>
                  </div>
                </div>
              )}

              {linkStatus === 'success' && (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">{linkMessage}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* DISPLAY OBTAINED COORDINATES & LOCATION STATUS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Obtained Farm Coordinates & Location Status</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Latitude Display */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Latitude
            </span>
            <div className="font-mono text-base font-bold text-slate-900 dark:text-white">
              {location.latitude !== undefined && location.latitude !== null ? `${location.latitude.toFixed(6)}° N` : 'Not Set'}
            </div>
          </div>

          {/* Longitude Display */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Longitude
            </span>
            <div className="font-mono text-base font-bold text-slate-900 dark:text-white">
              {location.longitude !== undefined && location.longitude !== null ? `${location.longitude.toFixed(6)}° E` : 'Not Set'}
            </div>
          </div>

          {/* Location Status Display */}
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block mb-1">
              Location Status
            </span>
            <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
              <span>{getLocationStatusText()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* MAP PREVIEW (Free OpenStreetMap Leaflet Engine - No Paid APIs) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Free OpenStreetMap Preview & Pin Adjustment
            </h3>
          </div>
          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
            Public Open Data (No Paid APIs)
          </span>
        </div>

        <InteractiveMapPicker
          latitude={location.latitude ?? null}
          longitude={location.longitude ?? null}
          onLocationSelect={handleMapPinSelected}
          altitudeMeters={location.altitudeMeters}
          locationLabel={location.district && location.state ? `${location.district}, ${location.state}` : undefined}
        />
      </div>

      {/* ARCHITECTURE FOR DETERMINING ADMINISTRATIVE DATA & ELEVATION */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Administrative Location Hierarchy & Agro-Climatic Baseline</span>
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Prepared architecture for determining administrative boundaries (State, District, Taluk/Tehsil, Village) and Elevation.
          </p>
        </div>

        {/* State, District, Taluk, Village Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* State */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              1. State
            </label>
            <select
              value={location.state}
              onChange={(e) => handleStateSelect(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
            >
              {!location.state && <option value="">-- Select State --</option>}
              {states.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* District */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              2. District
            </label>
            <select
              value={location.district}
              onChange={(e) => handleDistrictSelect(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
            >
              {!location.district && <option value="">-- Select District --</option>}
              {currentDistricts.map((d) => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Taluk / Tehsil */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              3. Taluk / Tehsil
            </label>
            {availableTaluks.length > 0 ? (
              <select
                value={location.taluka || availableTaluks[0]}
                onChange={(e) => onChange({ ...location, taluka: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
              >
                {availableTaluks.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={location.taluka || ''}
                onChange={(e) => onChange({ ...location, taluka: e.target.value })}
                placeholder="Administrative location data will be retrieved when the location dataset is connected."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            )}
          </div>

          {/* Village */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              4. Village / Locality
            </label>
            <input
              type="text"
              value={location.village || ''}
              onChange={(e) => onChange({ ...location, village: e.target.value })}
              placeholder={location.village ? location.village : "Administrative location data will be retrieved when the location dataset is connected."}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Informational callout if village/taluk are not connected */}
        {(!location.village || !location.taluka) && (
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-500 shrink-0" />
            <span>Administrative location data will be retrieved when the location dataset is connected.</span>
          </div>
        )}

        {/* Altitude & Elevation Display */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* Elevation */}
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              <Mountain className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-500 font-bold uppercase text-[10px] block">Elevation / Altitude</span>
              <strong className="text-slate-900 dark:text-white">
                {isElevationLoading ? (
                  <span className="text-slate-400 italic">Checking public elevation data...</span>
                ) : location.altitudeMeters !== null && location.altitudeMeters !== undefined ? (
                  `${location.altitudeMeters} meters (${Math.round(location.altitudeMeters * 3.28)} ft)`
                ) : (
                  <span className="text-slate-500">Elevation data unavailable</span>
                )}
              </strong>
            </div>
          </div>

          {/* Agro-Climatic Zone */}
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-500 font-bold uppercase text-[10px] block">Agro-Climatic Zone</span>
              <strong className="text-slate-900 dark:text-white">
                {currentZone ? `Zone ${currentZone.id}: ${currentZone.name}` : 'Pending Location Selection'}
              </strong>
            </div>
          </div>

          {/* Normal Annual Rainfall */}
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-500 font-bold uppercase text-[10px] block">Annual Rainfall Baseline</span>
              <strong className="text-slate-900 dark:text-white">
                {location.normalAnnualRainfallMm !== null && location.normalAnnualRainfallMm !== undefined
                  ? `${location.normalAnnualRainfallMm} mm / year (IMD Data)`
                  : 'Pending Location Selection'}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
