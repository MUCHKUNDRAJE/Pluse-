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

// fklikjklfjklggjgkjkglj

/**
 * Real Nagpur & Maharashtra Hospitals Dataset
 */
const NAGPUR_REAL_HOSPITALS: Hospital[] = [
  {
    id: "ngp-hosp-0",
    name: "Nandanvan Life Care Emergency Hospital",
    address: "KDK College Road, Nandanvan, Nagpur, Maharashtra 440009",
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
    address: "Garoba Maidan, Nandanvan Road, Nagpur, Maharashtra 440009",
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
    address: "Near Sakkardara Square, Nandanvan Zone, Nagpur, Maharashtra 440024",
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
    address: "Resimbagh Square, Near Nandanvan, Nagpur, Maharashtra 440009",
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
    name: "Government Medical College & Hospital (GMC Nagpur)",
    address: "Medical Square, Hanuman Nagar, Near Nandanvan, Nagpur, Maharashtra 440009",
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
    return "Nandanvan, Nagpur, Maharashtra, India";
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
 * INCREMENTAL RADIUS EXPANSION SEARCH (1km -> 2km -> 3km -> 5km -> 10km -> 20km)
 * Finds the absolute nearest hospital with minimum distance (min km).
 */
export async function getRealLocationAndHospitals(
  userLat: number = DEFAULT_NAGPUR_LAT,
  userLng: number = DEFAULT_NAGPUR_LNG
): Promise<LiveLocationData> {
  const locationName = await getCityNameFromCoords(userLat, userLng);
  let rawCandidates: Hospital[] = [];

  const isNearNagpur = Math.hypot((userLat - DEFAULT_NAGPUR_LAT) * 111, (userLng - DEFAULT_NAGPUR_LNG) * 111) < 50;

  if (isNearNagpur) {
    // Compute exact distance in km for all Nagpur hospitals
    rawCandidates = NAGPUR_REAL_HOSPITALS.map((h) => {
      const dLat = (h.lat - userLat) * 111;
      const dLng = (h.lng - userLng) * 111 * Math.cos((userLat + h.lat) / 2 * (Math.PI / 180));
      const distanceKm = parseFloat(Math.max(0.6, Math.hypot(dLat, dLng)).toFixed(1));
      const etaMins = Math.max(2, Math.round((distanceKm / 35) * 60));

      return {
        ...h,
        distanceKm,
        etaMins,
        traumaCenterLevel: `${h.traumaCenterLevel.split('(')[0].trim()} (${distanceKm} km)`
      };
    });
  } else {
    // Fetch OSM Hospitals
    try {
      const searchUrl = `https://nominatim.openstreetmap.org/search?format=json&q=hospital&lat=${userLat}&lon=${userLng}&limit=10`;
      const res = await fetch(searchUrl, {
        headers: { 'User-Agent': 'PulseEmergencyApp/1.0 (contact@pulse-emergency.app)' },
        signal: AbortSignal.timeout(4000)
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          rawCandidates = data.map((h: any, idx: number) => {
            const hLat = parseFloat(h.lat);
            const hLng = parseFloat(h.lon);
            const dLat = (hLat - userLat) * 111;
            const dLng = (hLng - userLng) * 111 * Math.cos((userLat + hLat) / 2 * (Math.PI / 180));
            const distanceKm = parseFloat(Math.max(0.5, Math.hypot(dLat, dLng)).toFixed(1));
            const etaMins = Math.max(2, Math.round((distanceKm / 35) * 60));
            const rawName = h.display_name ? h.display_name.split(',')[0] : `Hospital Unit ${idx + 1}`;

            return {
              id: `real-hosp-${idx + 1}`,
              name: rawName.length > 3 ? rawName : `Local Emergency Hospital ${idx + 1}`,
              address: h.display_name ? h.display_name.split(',').slice(1, 4).join(',') : `${locationName}`,
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
              traumaCenterLevel: `Level 1 Emergency Care (${distanceKm} km)`,
              departmentOccupancy: [
                { department: "General Ward", generalOccupied: 120, generalFree: 30, icuOccupied: 0, icuFree: 0 },
                { department: "ICU", generalOccupied: 0, generalFree: 0, icuOccupied: 20, icuFree: 5 }
              ],
              resources: []
            };
          });
        }
      }
    } catch (err) {
      console.warn("OSM Hospital Search error:", err);
    }
  }

  if (rawCandidates.length === 0) {
    rawCandidates = NAGPUR_REAL_HOSPITALS;
  }

  // Sort strictly by MINIMUM DISTANCE (Min Km)
  rawCandidates.sort((a, b) => a.distanceKm - b.distanceKm);

  // INCREMENTAL RADIUS EXPANSION ALGORITHM: (1km -> 2km -> 3km -> 5km -> 10km -> 20km)
  const expansionSteps = [1.0, 2.0, 3.0, 5.0, 10.0, 20.0];
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

  // Save assigned hospital to LocalStorage for cross-tab sync
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
    name: "Patient (Nandanvan, Nagpur)",
    age: 32,
    gender: "Male",
    registrationNumber: `PULSE-NGP-${Math.floor(1000 + Math.random() * 9000)}`,
    reportedSymptoms: ["Acute Chest Pain", "Trauma Emergency", "Shortness of Breath"],
    allergies: ["Penicillin"],
    knownConditions: ["Hypertension"],
    medications: ["Baseline Medical"],
    callerSource: "Self",
    emergencyContact: {
      name: "Nagpur Emergency Helpline",
      relation: "Primary Contact",
      phone: "+91 712 274 0300"
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
    driverName: "Rajesh Kumar (Nagpur ALS Unit)",
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
