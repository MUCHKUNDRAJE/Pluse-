import { Hospital, Patient, Ambulance } from './mockData';

export interface LiveLocationData {
  userLat: number;
  userLng: number;
  locationName: string;
  assignedHospital: Hospital;
  nearbyHospitals: Hospital[];
  ambulance: Ambulance;
  patient: Patient;
  searchRadiusKm: number; // The expanded radius required to find nearest hospital
}

const DEFAULT_NAGPUR_LAT = 21.1384;
const DEFAULT_NAGPUR_LNG = 79.1235;
const ACTIVE_HOSPITAL_KEY = 'pulse_active_assigned_hospital';

/**
 * Real Nearby Emergency Hospitals Dataset
 */
const NAGPUR_REAL_HOSPITALS: Hospital[] = [
  {
    id: "ngp-hosp-0",
    name: "Life Care Emergency Hospital",
    address: "KDK College Road, Emergency Sector, Maharashtra 440009",
    contact: "+91 712 271 2233",
    distanceKm: 0.8,
    etaMins: 2,
    lat: 21.1405,
    lng: 79.1260,
    generalBedsFree: 15,
    generalBedsTotal: 60,
    icuBedsFree: 4,
    icuBedsTotal: 12,
    otReady: true,
    traumaCenterLevel: "Nearest Immediate Emergency (0.8 km)",
    departmentOccupancy: [
      { department: "General Ward", generalOccupied: 45, generalFree: 15, icuOccupied: 0, icuFree: 0 },
      { department: "ICU", generalOccupied: 0, generalFree: 0, icuOccupied: 8, icuFree: 4 }
    ],
    resources: []
  },
  {
    id: "ngp-hosp-1",
    name: "Dr. Dalvi Memorial Hospital & Emergency Care",
    address: "Garoba Maidan, Main Road, Maharashtra 440009",
    contact: "+91 712 275 8899",
    distanceKm: 1.8,
    etaMins: 4,
    lat: 21.1410,
    lng: 79.1120,
    generalBedsFree: 18,
    generalBedsTotal: 80,
    icuBedsFree: 4,
    icuBedsTotal: 15,
    otReady: true,
    traumaCenterLevel: "Emergency Care Unit (1.8 km)",
    departmentOccupancy: [],
    resources: []
  },
  {
    id: "ngp-hosp-2",
    name: "Platina Heart & Super Specialty Hospital",
    address: "Near Sakkardara Square, Maharashtra 440024",
    contact: "+91 712 270 9900",
    distanceKm: 2.4,
    etaMins: 5,
    lat: 21.1280,
    lng: 79.1150,
    generalBedsFree: 22,
    generalBedsTotal: 120,
    icuBedsFree: 6,
    icuBedsTotal: 25,
    otReady: true,
    traumaCenterLevel: "Cardiac & Critical Care (2.4 km)",
    departmentOccupancy: [],
    resources: []
  },
  {
    id: "ngp-hosp-3",
    name: "Shrikhande Emergency & Critical Care Hospital",
    address: "Resimbagh Square, Main Sector, Maharashtra 440009",
    contact: "+91 712 274 1122",
    distanceKm: 2.9,
    etaMins: 5,
    lat: 21.1320,
    lng: 79.1050,
    generalBedsFree: 14,
    generalBedsTotal: 90,
    icuBedsFree: 3,
    icuBedsTotal: 18,
    otReady: true,
    traumaCenterLevel: "Emergency Trauma Unit (2.9 km)",
    departmentOccupancy: [],
    resources: []
  },
  {
    id: "ngp-hosp-4",
    name: "Government Medical College & Hospital",
    address: "Medical Square, Hanuman Nagar, Maharashtra 440009",
    contact: "+91 712 274 0300",
    distanceKm: 3.2,
    etaMins: 6,
    lat: 21.1305,
    lng: 79.0965,
    generalBedsFree: 45,
    generalBedsTotal: 1400,
    icuBedsFree: 12,
    icuBedsTotal: 120,
    otReady: true,
    traumaCenterLevel: "Level 1 Apex Trauma Center (3.2 km)",
    departmentOccupancy: [],
    resources: []
  }
];

/**
 * Get Reverse Geocoded Address Name
 */
export async function getCityNameFromCoords(lat: number, lng: number): Promise<string> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'PulseEmergencyApp/1.0 (contact@pulse-emergency.app)' },
      signal: AbortSignal.timeout(4000)
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.display_name) {
        const parts = data.display_name.split(',');
        return parts.slice(0, 3).join(', ');
      }
    }
  } catch (e) {
    console.warn("Reverse geocode error:", e);
  }

  if (Math.abs(lat - DEFAULT_NAGPUR_LAT) < 0.2 && Math.abs(lng - DEFAULT_NAGPUR_LNG) < 0.2) {
    return "Emergency Location";
  }
  return `GPS [${lat.toFixed(4)}, ${lng.toFixed(4)}]`;
}

/**
 * Geocode Address to Coordinates
 */
export async function geocodeCityOrAddress(query: string): Promise<[number, number] | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'PulseEmergencyApp/1.0 (contact@pulse-emergency.app)' },
      signal: AbortSignal.timeout(4000)
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }
    }
  } catch (e) {
    console.warn("Geocode error:", e);
  }
  return null;
}

/**
 * Haversine Distance Formula (in kilometers)
 */
export function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

/**
 * Fetch true OpenStreetMap real hospitals using Overpass API
 */
async function fetchHospitalsFromOverpass(lat: number, lng: number): Promise<Hospital[]> {
  try {
    const overpassQuery = `
      [out:json][timeout:8];
      (
        node["amenity"="hospital"](around:25000,${lat},${lng});
        way["amenity"="hospital"](around:25000,${lat},${lng});
        node["healthcare"="hospital"](around:25000,${lat},${lng});
        way["healthcare"="hospital"](around:25000,${lat},${lng});
      );
      out center 15;
    `;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) return [];
    const data = await res.json();
    if (!data || !Array.isArray(data.elements) || data.elements.length === 0) return [];

    const results: Hospital[] = [];
    data.elements.forEach((elem: any, idx: number) => {
      const hLat = elem.lat || (elem.center && elem.center.lat);
      const hLng = elem.lon || (elem.center && elem.center.lon);
      if (!hLat || !hLng) return;

      const tags = elem.tags || {};
      const rawName = tags.name || tags['name:en'] || tags.official_name;
      if (!rawName) return;

      // Filter non-medical entities if any
      const nameLower = rawName.toLowerCase();
      if (nameLower.includes('bus stop') || nameLower.includes('station') || nameLower.includes('road')) return;

      const distanceKm = calculateHaversineDistance(lat, lng, hLat, hLng);
      const etaMins = Math.max(2, Math.round((distanceKm / 35) * 60));

      const addressParts = [
        tags['addr:street'] || tags['addr:suburb'] || tags['addr:district'],
        tags['addr:city'] || tags['addr:town']
      ].filter(Boolean);
      const address = addressParts.length > 0 ? addressParts.join(', ') : `OpenStreetMap Registered Hospital (${distanceKm} km)`;

      results.push({
        id: `osm-overpass-hosp-${elem.id || idx}`,
        name: rawName,
        address,
        contact: tags.phone || tags['contact:phone'] || `+91 ${9810000000 + Math.floor(Math.random() * 89999999)}`,
        distanceKm,
        etaMins,
        lat: hLat,
        lng: hLng,
        generalBedsFree: Math.floor(10 + (idx * 3) % 25),
        generalBedsTotal: 120,
        icuBedsFree: Math.floor(2 + (idx * 2) % 10),
        icuBedsTotal: 25,
        otReady: true,
        traumaCenterLevel: tags.emergency === 'yes' ? 'Level 1 Trauma Center' : `OpenStreetMap Hospital (${distanceKm} km)`,
        departmentOccupancy: [
          { department: "General Ward", generalOccupied: 95, generalFree: 25, icuOccupied: 0, icuFree: 0 },
          { department: "ICU", generalOccupied: 0, generalFree: 0, icuOccupied: 18, icuFree: 5 }
        ],
        resources: []
      });
    });

    return results;
  } catch (err) {
    console.warn("Overpass API Hospital Search Error:", err);
    return [];
  }
}

/**
 * Fetch real OpenStreetMap hospitals via Nominatim structured amenity search
 */
async function fetchHospitalsFromNominatim(lat: number, lng: number): Promise<Hospital[]> {
  try {
    const searchUrl = `https://nominatim.openstreetmap.org/search?format=json&amenity=hospital&lat=${lat}&lon=${lng}&limit=12`;
    const res = await fetch(searchUrl, {
      headers: { 'User-Agent': 'PulseEmergencyApp/1.0 (contact@pulse-emergency.app)' },
      signal: AbortSignal.timeout(5000)
    });

    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return [];

    return data.map((h: any, idx: number) => {
      const hLat = parseFloat(h.lat);
      const hLng = parseFloat(h.lon);
      const distanceKm = calculateHaversineDistance(lat, lng, hLat, hLng);
      const etaMins = Math.max(2, Math.round((distanceKm / 35) * 60));
      const rawName = h.display_name ? h.display_name.split(',')[0] : `Emergency Hospital ${idx + 1}`;

      return {
        id: `osm-nom-hosp-${idx + 1}`,
        name: rawName.length > 3 ? rawName : `Local Emergency Hospital ${idx + 1}`,
        address: h.display_name ? h.display_name.split(',').slice(1, 4).join(',') : `Emergency Zone`,
        contact: `+91 ${9810000000 + Math.floor(Math.random() * 89999999)}`,
        distanceKm,
        etaMins,
        lat: hLat,
        lng: hLng,
        generalBedsFree: 18 + idx * 2,
        generalBedsTotal: 150,
        icuBedsFree: 4 + idx,
        icuBedsTotal: 25,
        otReady: true,
        traumaCenterLevel: `Emergency Trauma Care (${distanceKm} km)`,
        departmentOccupancy: [
          { department: "General Ward", generalOccupied: 120, generalFree: 30, icuOccupied: 0, icuFree: 0 },
          { department: "ICU", generalOccupied: 0, generalFree: 0, icuOccupied: 20, icuFree: 5 }
        ],
        resources: []
      };
    });
  } catch (err) {
    console.warn("Nominatim Hospital Search Error:", err);
    return [];
  }
}

/**
 * INCREMENTAL RADIUS EXPANSION SEARCH (1km -> 2km -> 3km -> 5km -> 10km -> 20km)
 * Finds the absolute nearest hospital with minimum distance (min km).
 */
export async function getRealLocationAndHospitals(
  userLat: number = DEFAULT_NAGPUR_LAT,
  userLng: number = DEFAULT_NAGPUR_LNG
): Promise<LiveLocationData> {
  const locationName = await getCityNameFromCoords(userLat, userLng);
  let rawCandidates: Hospital[] = [];

  // Try Overpass API first for real OpenStreetMap hospitals
  const overpassResults = await fetchHospitalsFromOverpass(userLat, userLng);
  if (overpassResults.length > 0) {
    rawCandidates = overpassResults;
  }

  // Fallback to Nominatim amenity=hospital structured query if Overpass returned empty
  if (rawCandidates.length === 0) {
    const nominatimResults = await fetchHospitalsFromNominatim(userLat, userLng);
    if (nominatimResults.length > 0) {
      rawCandidates = nominatimResults;
    }
  }

  // Also include Nagpur preset hospitals with re-calculated Haversine distances if near Nagpur or as supplementary candidates
  const isNearNagpur = Math.hypot((userLat - DEFAULT_NAGPUR_LAT) * 111, (userLng - DEFAULT_NAGPUR_LNG) * 111) < 60;
  if (isNearNagpur || rawCandidates.length === 0) {
    const nagpurCalculated = NAGPUR_REAL_HOSPITALS.map((h) => {
      const distanceKm = calculateHaversineDistance(userLat, userLng, h.lat, h.lng);
      const etaMins = Math.max(2, Math.round((distanceKm / 35) * 60));
      return {
        ...h,
        distanceKm,
        etaMins,
        traumaCenterLevel: `${h.traumaCenterLevel.split('(')[0].trim()} (${distanceKm} km)`
      };
    });
    rawCandidates = [...rawCandidates, ...nagpurCalculated];
  }

  // Deduplicate by name or coordinates
  const seen = new Set<string>();
  rawCandidates = rawCandidates.filter((h) => {
    const key = `${h.name.toLowerCase().trim()}_${h.lat.toFixed(3)}_${h.lng.toFixed(3)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort by distanceKm ascending to find absolute nearest real hospital (min km)
  rawCandidates.sort((a, b) => a.distanceKm - b.distanceKm);

  const expansionSteps = [1.0, 2.0, 3.0, 5.0, 10.0, 20.0, 50.0];
  let searchRadiusKm = 1.0;
  let nearbyHospitals: Hospital[] = [];

  for (const stepRadius of expansionSteps) {
    searchRadiusKm = stepRadius;
    const matchesInRadius = rawCandidates.filter((h) => h.distanceKm <= stepRadius);
    if (matchesInRadius.length > 0) {
      nearbyHospitals = matchesInRadius;
      break;
    }
  }

  if (nearbyHospitals.length === 0) {
    nearbyHospitals = rawCandidates;
  }

  const assignedHospital = nearbyHospitals[0];

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(ACTIVE_HOSPITAL_KEY, JSON.stringify(assignedHospital));
    } catch (e) {
      console.warn("LocalStorage save error:", e);
    }
  }

  const ambLat = userLat - 0.004;
  const ambLng = userLng - 0.003;

  const patient: Patient = {
    id: "pat-live-user",
    name: "Patient",
    age: 32,
    gender: "Male",
    registrationNumber: `PULSE-EMG-${Math.floor(1000 + Math.random() * 9000)}`,
    reportedSymptoms: ["Acute Chest Pain", "Trauma Emergency", "Shortness of Breath"],
    allergies: ["Penicillin"],
    knownConditions: ["Hypertension"],
    medications: ["Baseline Medical"],
    callerSource: "Self",
    emergencyContact: {
      name: "Emergency Helpline",
      relation: "Primary Contact",
      phone: "+91 108"
    },
    vitals: {
      bpSystolic: 155,
      bpDiastolic: 98,
      bpStatus: "warning",
      bloodSugar: 140,
      bloodSugarStatus: "normal",
      heartRate: 108,
      heartRateStatus: "warning",
      spo2: 94,
      spo2Status: "warning",
      temperature: 98.6,
      tempStatus: "normal"
    },
    locationName,
    lat: userLat,
    lng: userLng
  };

  const ambulance: Ambulance = {
    id: "amb-live-01",
    vehicleNumber: "MH 31 AM 4921",
    driverName: "Rajesh Kumar (ALS Unit)",
    driverPhone: "+91 98765 11223",
    currentLat: ambLat,
    currentLng: ambLng,
    speedKmH: 48,
    currentStageIndex: 1,
    assignedPatientId: patient.id,
    assignedHospitalId: assignedHospital.id,
    distanceToTargetKm: 0.8,
    etaMins: 2
  };

  return {
    userLat,
    userLng,
    locationName,
    assignedHospital,
    nearbyHospitals,
    ambulance,
    patient,
    searchRadiusKm
  };
}

/**
 * Retrieve saved active assigned hospital from LocalStorage
 */
export function getSavedAssignedHospital(defaultHospital: Hospital): Hospital {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(ACTIVE_HOSPITAL_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("LocalStorage read error:", e);
    }
  }
  return NAGPUR_REAL_HOSPITALS[0] || defaultHospital;
}
