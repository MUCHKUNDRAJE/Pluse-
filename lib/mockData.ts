export interface HospitalResource {
  id: string;
  name: string;
  category: 'General Capacity' | 'Operation Theatre Equipment' | 'Patient Monitoring Equipment' | 'Diagnostic Imaging' | 'Laboratory';
  available: number;
  total: number;
  status: 'Available' | 'Limited' | 'Critical';
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  contact: string;
  distanceKm: number;
  etaMins: number;
  lat: number;
  lng: number;
  generalBedsFree: number;
  generalBedsTotal: number;
  icuBedsFree: number;
  icuBedsTotal: number;
  otReady: boolean;
  traumaCenterLevel: string;
  resources: HospitalResource[];
  departmentOccupancy: {
    department: string;
    generalOccupied: number;
    generalFree: number;
    icuOccupied: number;
    icuFree: number;
  }[];
}

export interface PatientVitals {
  bpSystolic: number;
  bpDiastolic: number;
  bpStatus: 'normal' | 'warning' | 'critical';
  bloodSugar: number; // mg/dL
  bloodSugarStatus: 'normal' | 'warning' | 'critical';
  heartRate: number; // bpm
  heartRateStatus: 'normal' | 'warning' | 'critical';
  spo2: number; // percentage
  spo2Status: 'normal' | 'warning' | 'critical';
  temperature: number; // °F
  tempStatus: 'normal' | 'warning' | 'critical';
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  registrationNumber: string;
  reportedSymptoms: string[];
  allergies: string[];
  knownConditions: string[];
  medications: string[];
  callerSource: 'Self' | 'Family/Friend' | 'Bystander' | 'Colleague';
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  vitals: PatientVitals;
  locationName: string;
  lat: number;
  lng: number;
}

export interface Ambulance {
  id: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  currentLat: number;
  currentLng: number;
  speedKmH: number;
  currentStageIndex: number; // 0: Dispatched, 1: En Route to Patient, 2: Patient Picked Up, 3: En Route to Hospital, 4: Arrived
  assignedPatientId: string;
  assignedHospitalId: string;
  distanceToTargetKm: number;
  etaMins: number;
}

export interface IncidentEvent {
  id: string;
  stageName: string;
  timestamp: string;
  description: string;
  iconType: 'phone' | 'truck' | 'check' | 'hospital' | 'user';
  completed: boolean;
}

// SAMPLE DATA DATASET
export const mockHospitals: Hospital[] = [
  {
    id: "hosp-1",
    name: "Apex Super Specialty Hospital",
    address: "Sector 14, Central Boulevard, Medical Enclave",
    contact: "+91 98765 43210",
    distanceKm: 3.8,
    etaMins: 9,
    lat: 28.6139,
    lng: 77.2090,
    generalBedsFree: 18,
    generalBedsTotal: 120,
    icuBedsFree: 4,
    icuBedsTotal: 25,
    otReady: true,
    traumaCenterLevel: "Level 1 Trauma Center",
    departmentOccupancy: [
      { department: "General Ward", generalOccupied: 102, generalFree: 18, icuOccupied: 0, icuFree: 0 },
      { department: "ICU", generalOccupied: 0, generalFree: 0, icuOccupied: 21, icuFree: 4 },
      { department: "Emergency", generalOccupied: 16, generalFree: 4, icuOccupied: 8, icuFree: 2 },
      { department: "Maternity", generalOccupied: 28, generalFree: 7, icuOccupied: 3, icuFree: 2 },
      { department: "Pediatric", generalOccupied: 19, generalFree: 6, icuOccupied: 2, icuFree: 3 }
    ],
    resources: [
      // Capacity
      { id: "r1", name: "General Ward Beds", category: "General Capacity", available: 18, total: 120, status: "Available" },
      { id: "r2", name: "ICU Beds", category: "General Capacity", available: 4, total: 25, status: "Limited" },
      { id: "r3", name: "Emergency Stretchers", category: "General Capacity", available: 8, total: 15, status: "Available" },
      { id: "r4", name: "Operation Theatres (OT)", category: "General Capacity", available: 2, total: 6, status: "Available" },
      { id: "r5", name: "Isolation Rooms", category: "General Capacity", available: 1, total: 10, status: "Critical" },

      // OT Equipment
      { id: "r6", name: "Anesthesia Workstation", category: "Operation Theatre Equipment", available: 5, total: 6, status: "Available" },
      { id: "r7", name: "Electrosurgical Unit", category: "Operation Theatre Equipment", available: 6, total: 6, status: "Available" },
      { id: "r8", name: "Laparoscopy System", category: "Operation Theatre Equipment", available: 3, total: 4, status: "Available" },
      { id: "r9", name: "Surgical Monitor", category: "Operation Theatre Equipment", available: 8, total: 8, status: "Available" },
      { id: "r10", name: "Surgical Camera & Light", category: "Operation Theatre Equipment", available: 6, total: 6, status: "Available" },
      { id: "r11", name: "Patient Warming System", category: "Operation Theatre Equipment", available: 4, total: 5, status: "Available" },

      // Patient Monitoring
      { id: "r12", name: "Digital Patient Monitors", category: "Patient Monitoring Equipment", available: 28, total: 35, status: "Available" },
      { id: "r13", name: "ECG / EKG Machines", category: "Patient Monitoring Equipment", available: 9, total: 10, status: "Available" },
      { id: "r14", name: "Pulse Oximeters (High-Flow)", category: "Patient Monitoring Equipment", available: 40, total: 45, status: "Available" },
      { id: "r15", name: "Digital BP Monitors", category: "Patient Monitoring Equipment", available: 22, total: 25, status: "Available" },
      { id: "r16", name: "Capnography Monitors", category: "Patient Monitoring Equipment", available: 5, total: 8, status: "Available" },
      { id: "r17", name: "Fetal / CTG Monitors", category: "Patient Monitoring Equipment", available: 4, total: 6, status: "Available" },

      // Diagnostic
      { id: "r18", name: "Digital X-Ray", category: "Diagnostic Imaging", available: 2, total: 3, status: "Available" },
      { id: "r19", name: "CT Scanner (128-Slice)", category: "Diagnostic Imaging", available: 1, total: 2, status: "Limited" },
      { id: "r20", name: "3T MRI Unit", category: "Diagnostic Imaging", available: 1, total: 1, status: "Available" },
      { id: "r21", name: "Ultrasound & Color Doppler", category: "Diagnostic Imaging", available: 4, total: 5, status: "Available" },
      { id: "r22", name: "Digital Mammography", category: "Diagnostic Imaging", available: 1, total: 1, status: "Available" },
      { id: "r23", name: "PET-CT Scanner", category: "Diagnostic Imaging", available: 0, total: 1, status: "Critical" },

      // Laboratory
      { id: "r24", name: "Automated Blood Analyzer", category: "Laboratory", available: 3, total: 3, status: "Available" },
      { id: "r25", name: "Biochemistry Analyzer", category: "Laboratory", available: 2, total: 2, status: "Available" },
      { id: "r26", name: "Immunoassay Analyzer", category: "Laboratory", available: 2, total: 2, status: "Available" },
      { id: "r27", name: "RT-PCR Machine", category: "Laboratory", available: 4, total: 4, status: "Available" },
      { id: "r28", name: "Blood Gas (ABG) Analyzer", category: "Laboratory", available: 3, total: 3, status: "Available" },
      { id: "r29", name: "Electrolyte Analyzer", category: "Laboratory", available: 2, total: 2, status: "Available" },
      { id: "r30", name: "Digital Microscope", category: "Laboratory", available: 5, total: 5, status: "Available" },
    ]
  },
  {
    id: "hosp-2",
    name: "St. Jude Emergency & Trauma Care",
    address: "Block B, Ring Road Intersection",
    contact: "+91 98111 22334",
    distanceKm: 5.2,
    etaMins: 14,
    lat: 28.6250,
    lng: 77.2180,
    generalBedsFree: 8,
    generalBedsTotal: 90,
    icuBedsFree: 1,
    icuBedsTotal: 15,
    otReady: false,
    traumaCenterLevel: "Level 2 Emergency",
    departmentOccupancy: [
      { department: "General Ward", generalOccupied: 82, generalFree: 8, icuOccupied: 0, icuFree: 0 },
      { department: "ICU", generalOccupied: 0, generalFree: 0, icuOccupied: 14, icuFree: 1 },
      { department: "Emergency", generalOccupied: 18, generalFree: 2, icuOccupied: 5, icuFree: 1 },
      { department: "Maternity", generalOccupied: 15, generalFree: 3, icuOccupied: 2, icuFree: 1 },
      { department: "Pediatric", generalOccupied: 12, generalFree: 4, icuOccupied: 1, icuFree: 1 }
    ],
    resources: [
      { id: "r31", name: "General Ward Beds", category: "General Capacity", available: 8, total: 90, status: "Limited" },
      { id: "r32", name: "ICU Beds", category: "General Capacity", available: 1, total: 15, status: "Critical" },
      { id: "r33", name: "Operation Theatres (OT)", category: "General Capacity", available: 0, total: 3, status: "Critical" }
    ]
  },
  {
    id: "hosp-3",
    name: "City Heart & Critical Care Institute",
    address: "Avenue 7, Tech Corridor",
    contact: "+91 97777 88899",
    distanceKm: 7.1,
    etaMins: 18,
    lat: 28.5980,
    lng: 77.1950,
    generalBedsFree: 32,
    generalBedsTotal: 150,
    icuBedsFree: 9,
    icuBedsTotal: 30,
    otReady: true,
    traumaCenterLevel: "Cardiac Specialty Center",
    departmentOccupancy: [
      { department: "General Ward", generalOccupied: 118, generalFree: 32, icuOccupied: 0, icuFree: 0 },
      { department: "ICU", generalOccupied: 0, generalFree: 0, icuOccupied: 21, icuFree: 9 },
      { department: "Emergency", generalOccupied: 12, generalFree: 8, icuOccupied: 4, icuFree: 4 }
    ],
    resources: [
      { id: "r34", name: "General Ward Beds", category: "General Capacity", available: 32, total: 150, status: "Available" },
      { id: "r35", name: "ICU Beds", category: "General Capacity", available: 9, total: 30, status: "Available" }
    ]
  }
];

export const mockPatients: Patient[] = [
  {
    id: "pat-101",
    name: "Rahul Verma",
    age: 48,
    gender: "Male",
    registrationNumber: "CR-2026-8849",
    reportedSymptoms: ["Acute Chest Pain", "Shortness of Breath", "Diaphoresis", "Left Arm Numbness"],
    allergies: ["Penicillin", "Sulfa Drugs"],
    knownConditions: ["Hypertension (5 yrs)", "Type 2 Diabetes"],
    medications: ["Metformin 500mg", "Amlodipine 5mg"],
    callerSource: "Family/Friend",
    emergencyContact: {
      name: "Sunita Verma",
      relation: "Wife",
      phone: "+91 98123 45678"
    },
    vitals: {
      bpSystolic: 165,
      bpDiastolic: 105,
      bpStatus: "critical",
      bloodSugar: 210,
      bloodSugarStatus: "warning",
      heartRate: 112,
      heartRateStatus: "warning",
      spo2: 92,
      spo2Status: "warning",
      temperature: 98.6,
      tempStatus: "normal"
    },
    locationName: "Flat 402, Sunshine Heights, MG Road",
    lat: 28.6050,
    lng: 77.2150
  },
  {
    id: "pat-102",
    name: "Priya Sharma",
    age: 29,
    gender: "Female",
    registrationNumber: "CR-2026-9012",
    reportedSymptoms: ["Severe Abdominal Pain", "Dizziness", "High Fever"],
    allergies: ["None Reported"],
    knownConditions: ["Asthma"],
    medications: ["Albuterol Inhaler"],
    callerSource: "Self",
    emergencyContact: {
      name: "Vikram Sharma",
      relation: "Brother",
      phone: "+91 98999 11122"
    },
    vitals: {
      bpSystolic: 118,
      bpDiastolic: 78,
      bpStatus: "normal",
      bloodSugar: 98,
      bloodSugarStatus: "normal",
      heartRate: 94,
      heartRateStatus: "normal",
      spo2: 98,
      spo2Status: "normal",
      temperature: 102.4,
      tempStatus: "warning"
    },
    locationName: "Building 12, Cyber Park",
    lat: 28.6210,
    lng: 77.2010
  }
];

export const mockAmbulances: Ambulance[] = [
  {
    id: "amb-01",
    vehicleNumber: "DL 01 AM 4921",
    driverName: "Rajesh Kumar",
    driverPhone: "+91 98765 11223",
    currentLat: 28.5950,
    currentLng: 77.2250,
    speedKmH: 48,
    currentStageIndex: 1, // En Route to Patient
    assignedPatientId: "pat-101",
    assignedHospitalId: "hosp-1",
    distanceToTargetKm: 2.4,
    etaMins: 6
  },
  {
    id: "amb-02",
    vehicleNumber: "DL 04 EX 8820",
    driverName: "Amit Singh",
    driverPhone: "+91 98333 44556",
    currentLat: 28.6180,
    currentLng: 77.1980,
    speedKmH: 52,
    currentStageIndex: 3, // En Route to Hospital
    assignedPatientId: "pat-102",
    assignedHospitalId: "hosp-1",
    distanceToTargetKm: 1.8,
    etaMins: 4
  }
];

export const mockTimelineEvents: IncidentEvent[] = [
  {
    id: "t1",
    stageName: "Emergency Call Placed",
    timestamp: "18:02:15 - Aug 17, 2026",
    description: "SOS call received from Sunita Verma. Patient reported severe chest pain & shortness of breath.",
    iconType: "phone",
    completed: true
  },
  {
    id: "t2",
    stageName: "Ambulance Dispatched",
    timestamp: "18:03:40 - Aug 17, 2026",
    description: "Advanced Cardiac Life Support (ALS) Unit #DL-01-AM-4921 assigned with Driver Rajesh Kumar.",
    iconType: "truck",
    completed: true
  },
  {
    id: "t3",
    stageName: "En Route to Patient",
    timestamp: "18:04:10 - Aug 17, 2026",
    description: "Ambulance navigating via fastest OSRM route. Estimated arrival in 6 mins.",
    iconType: "truck",
    completed: true
  },
  {
    id: "t4",
    stageName: "Patient Picked Up",
    timestamp: "18:10:25 - Aug 17, 2026",
    description: "Driver marked patient onboard. Initial telemetry & vital stats transmitted to hospital.",
    iconType: "user",
    completed: false
  },
  {
    id: "t5",
    stageName: "En Route to Assigned Hospital",
    timestamp: "Pending",
    description: "Routing to Apex Super Specialty Hospital (ICU Bed & Cath Lab reserved).",
    iconType: "hospital",
    completed: false
  },
  {
    id: "t6",
    stageName: "Hospital Emergency Handover",
    timestamp: "Pending",
    description: "Arrival at Emergency Bay & doctor handover.",
    iconType: "check",
    completed: false
  }
];
