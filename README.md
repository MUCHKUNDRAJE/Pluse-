# PULSE — Call & Report Emergency Ambulance Dispatch Platform

> **"One tap. Fastest help."**  
> A modern, high-urgency Emergency Ambulance Dispatch and Hospital Operations Web Application connecting Patients/Bystanders, Ambulance Drivers, and Hospital Operations Teams in real time.

---

## 🚑 Project Overview

**PULSE (Call & Report)** is an emergency response web application engineered for high-stress, high-urgency medical dispatch scenarios. Built using **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Leaflet**, and **Free OSRM Routing**, PULSE provides end-to-end coordination from the initial emergency call to patient pickup and hospital emergency room handover.

---

## ✨ Key Features & Interfaces

### 1. 🏠 Landing & Role Selection (`/`)
- **Emergency Hero Section**: High-contrast, mobile-first interface.
- **Persona Shortcuts**:
  - 🚑 **Ambulance Driver Cockpit** (`/ambulance`)
  - 🏥 **Hospital Operations Dashboard** (`/hospital`)
  - 👤 **Patient Incident Portal** (`/patient`)
- **Secondary Emergency SOS FAB**: Always-visible floating action button equipped with browser **Geolocation API** (`navigator.geolocation.getCurrentPosition`) capture to immediately dispatch an ambulance to the user's live coordinates.

### 2. 🚑 Ambulance Driver Cockpit (`/ambulance`)
- **Drag-Enabled White Light Map Canvas**:
  - Interactive Leaflet map canvas supporting full mouse dragging, touch panning, and scroll zooming.
  - Live animated vehicle position marker (`MH 31 AM 4921`) and patient pin.
  - Live OSRM polyline route rendering with dynamic ETA and distance readouts.
- **Trip Status Panel**:
  - 5-stage stepper: `Dispatched → En Route to Patient → Patient Picked Up → En Route to Hospital → Arrived`.
  - **"Mark Patient Picked Up"** action button: Automatically recalculates OSRM driving route strictly between **Patient Location $\rightarrow$ Assigned Hospital**.
- **Incremental Radius Expansion Search**:
  - Checks hospital radius sequentially: `1km → 2km → 3km → 5km → 10km → 20km`.
  - Auto-assigns the hospital with the absolute **minimum distance (Min Km)**.
- **Location Controls**:
  - **Detect GPS**: Live browser GPS locator.
  - **Nandanvan, Nagpur Preset**: Quick-switch to Nandanvan, Nagpur, Maharashtra, India.
  - **Search Address**: Search bar to locate any city or landmark worldwide.

### 3. 🏥 Hospital Operations Dashboard (`/hospital`)
- **Incoming Ambulance Feed**: Real-time cards of en-route ambulances showing patient vitals snapshot, driver details, live ETA, and expandable mini route preview.
- **Facility Readiness Matrix**: Interactive capacity & equipment grid across 5 categories:
  1. *General Capacity* (Beds, Stretchers, Rooms, ICU Beds, OT Rooms)
  2. *Operation Theatre Equipment* (Anesthesia workstation, Electrosurgical unit, Laparoscopy system, Monitors)
  3. *Patient Monitoring Equipment* (Digital patient monitors, ECG/EKG, Pulse oximeters, Capnography)
  4. *Diagnostic Imaging* (X-Ray, CT Scan, MRI, Ultrasound, Mammography, PET-CT)
  5. *Laboratory* (Blood analyzer, Biochemistry, PCR, Blood Gas, Microscope)
- **Bed Occupancy Breakdown**: Recharts bar chart and donut chart visualizing capacity across General, ICU, Emergency, Maternity, and Pediatric departments.
- **Hospital Name Sync**: Displays the exact name, address, distance, and trauma level of the assigned nearby hospital.

### 4. 👤 Patient Incident Portal (`/patient`)
- **Active Dispatch Stage Indicator**: Real-time stepper tracking ambulance arrival.
- **Patient Health Telemetry Panel (`VitalsCard`)**: Range-coded vitals (Blood Pressure, Blood Sugar, Heart Rate, SpO2, Body Temp), reported symptoms, allergies, ongoing medications, and caller details.
- **Incident Event Audit Log (`StatusTimeline`)**: Chronological post-incident log with timestamps for audit and emergency room handover.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS, Custom Utilities, Light Theme |
| **Map & GIS** | Leaflet, CartoDB Voyager Light Tiles |
| **Routing Engine** | Free OSRM Public Driving Route API (`router.project-osrm.org`) |
| **Geocoding API** | OpenStreetMap Nominatim API |
| **Charts** | Recharts |
| **Icons** | Lucide React |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18.0.0 or higher
- npm package manager

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd vikasit-bharat
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the local development server:**
   ```bash
   npm run dev
   ```

4. **Open in Browser:**
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## 📍 Default Coordinates & Locations

- **Default Location**: Nandanvan, Nagpur, Maharashtra, India (`Latitude 21.1384`, `Longitude 79.1235`)
- **Default Nearby Hospitals (Nagpur, Maharashtra)**:
  - **Nandanvan Life Care Emergency Hospital** — `0.8 km` (ETA 2 mins)
  - **Dr. Dalvi Memorial Hospital & Emergency Care** — `1.8 km` (ETA 4 mins)
  - **Platina Heart & Super Specialty Hospital** — `2.4 km` (ETA 5 mins)
  - **Shrikhande Emergency Hospital** — `2.9 km` (ETA 5 mins)
  - **Government Medical College & Hospital (GMC Nagpur)** — `3.2 km` (ETA 6 mins)

---

## 📁 Directory Structure

```
/app
  /layout.tsx                 → Root layout with global header & font setup
  /page.tsx                   → Landing / Role selection page & Emergency SOS FAB
  /ambulance/page.tsx         → Ambulance driver cockpit & live OSRM map
  /hospital/page.tsx          → Hospital operations dashboard & readiness grid
  /patient/page.tsx           → Patient incident tracking, vitals & timeline
  /not-found.tsx              → Custom 404 error page
/components
  /shared
    /StatusBadge.tsx          → Urgency pill status component (Red/Yellow/Green)
    /SectionCard.tsx          → Section container card wrapper
    /StageStepper.tsx         → Multi-step progress bar
  /map
    /CesiumMap.tsx            → Drag-enabled Leaflet map canvas with OSRM polylines
    /OsrmRoute.ts             → OSRM polyline helper
  /ambulance
    /TripStatusPanel.tsx      → Driver workflow stepper & hospital auto-assignment
  /hospital
    /AmbulanceFeed.tsx        → En-route incoming ambulance feed & mini map
    /ResourceGrid.tsx         → 5-category equipment readiness matrix
    /BedOccupancyChart.tsx    → Departmental capacity bar & donut charts
  /patient
    /VitalsCard.tsx           → Clinical telemetry & vitals range alerts
    /StatusTimeline.tsx       → Chronological post-incident audit timeline
/lib
  /osrm.ts                    → Free OSRM driving route API helper with fallback
  /locationStore.ts           → Geolocation, Nominatim geocoding & radius search
  /mockData.ts                → Dataset for hospitals, ambulances & patients
```

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
