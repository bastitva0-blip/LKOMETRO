<div align="center">

# 🚇 LkoMetro
### Your companion app for navigating the Lucknow Metro — routes, fares, and live tracking, in seconds.

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-https://lkometro.vercel.app/-9F1239?style=for-the-badge)](https://lkometro-svfa.vercel.app/)
[![View Presentation](https://img.shields.io/badge/📊_Presentation-Google_Slides-orange?style=for-the-badge)](https://docs.google.com/presentation/d/1QDZmr0qdIZguAzgds3jOiwQx3IKGKTen/edit?usp=sharing&ouid=115849183723543277039&rtpof=true&sd=true)

</div>

A modern Progressive Web App (PWA) for navigating the Lucknow Metro Red Line: route planning
with live fares and timings, simulated live train tracking, offline station/landmark search,
a co-commute meeting-point tool, crowd estimates, and a manual GoSmart Card balance tracker —
installable, themeable, and fully usable offline.

> **Disclaimer:** This app does not represent a government entity. Timings and fares are
> sourced from the official [lucknow.upmetrorail.com](https://lucknow.upmetrorail.com/).

**Built by [Astitva Bhardwaj](https://www.linkedin.com/in/astitva-bhardwajlu/)**
Inspired by **AhmMetro**, the Ahmedabad Metro companion app — credit to its developer,
[Ubaid](https://www.linkedin.com/in/notubaid/), for the original concept and approach this
project was modeled on.

## 🌐 Live Demo

**Website:** https://lkometro-svfa.vercel.app/

## ✨ Features

- 🗺️ Interactive Leaflet map of the Red Line (operational) and Blue Line (under construction),
  with custom train and station glyphs (distinct icons for regular, underground, and
  interchange stations)
- 🧭 Smart route planner — fare, duration, next-train time, step-by-step journey breakdown
- 💰 Fare calculation with GoSmart Card support (10% discount) and Tourist Card info
- 💳 GoSmart Card balance tracker — top up, deduct trips straight from the route planner, full
  transaction history, all stored locally on your device (manual tracker, not a live card read)
- 🚆 Simulated live train tracking, positions updated every 2 seconds
- 📍 Geolocation — find your nearest station and start your journey from there
- 🔍 Offline fuzzy search across all stations and ~70 Lucknow landmarks
- 👥 Co-commute / friends journey planner — finds the best station for two people to meet
- 📊 Crowd-level estimates by time of day and station
- 🌗 Light / Dark / System theme toggle, persisted across visits
- ℹ️ In-app About section — why the app exists, full privacy breakdown, and credits
- 📱 Fully responsive, mobile-first design
- 📴 Installable PWA with full offline support

## 🛠️ Tech Stack

**Frontend:** React 18 · TypeScript 5.7 (strict mode) · Vite 5 + SWC · React Router
**UI & Styling:** Tailwind CSS · Radix UI primitives · Lucide Icons · hand-built SVG icon set
**Mapping:** Leaflet
**PWA:** vite-plugin-pwa · Workbox

## 🚀 Getting Started

```bash
npm install
npm run dev      # http://localhost:5000
npm run build    # production build to dist/
npm run preview  # preview the production build
```

## 📂 Project Structure 
src/
├── components/       UI components (map, route planner, dialogs, etc.)
│   ├── ui/            Radix-based primitives (button, dialog, select, ...)
│   └── icons/Custom SVG icon components (train, station,underground, interchange)
├── contexts/GoSmartCardContext (balance + discount, persisted), ThemeContext
├── data/Stations, fares, timetable, crowd sim, landmarks
├── hooks/use-mobile, use-online-status, use-geolocation
├── lib/routePlanner, stationSearch, friendsJourney, nearestStation,
│leafletIcons, utils
├── page/Index (main app), NotFound
├── App.tsx
└── main.tsx
## 🧠 Architecture Details

### State management
No global state library — kept intentionally lightweight. React Context handles the pieces of
state needed app-wide: `GoSmartCardContext` (discount toggle, balance, transaction history) and
`ThemeContext` (light/dark/system preference), both persisted to `localStorage`. Everything
else is local component state. The data layer itself is pure and stateless — plain functions
over static data — so there's little state to synchronize across the tree.

### Data source
All station, fare, and timing data is sourced from official UPMRC published figures (route
map, fare chart, headway, operating hours) and encoded as static TypeScript modules — no
backend, no database. See **Data notes** below for specifics on what's official vs. derived.

### Route calculation algorithm
Lucknow Metro currently has one operational line with no junctions, so route planning is an
ordered-array slice rather than graph search:
1. Look up both stations' index in the line's ordered station list
2. Slice the array between the two indices to get stations passed through; station count =
   index difference
3. Look up fare from the official slab table using that count
4. Scan generated train schedules for the next train serving both stations in order, sorted
   by departure time

The planner is **line-aware, not hardcoded to Red Line** — `routePlanner.ts` already includes
interchange-routing logic via Charbagh (the future Red↔Blue interchange), so when the Blue
Line opens, cross-line journeys route automatically with no algorithm changes, only a data
flag flip (`isWIP: false`).

Other notable logic:
- **Nearest-station / geolocation** (`nearestStation.ts`) — haversine distance from the
  user's GPS position against all operational stations, with walking-time estimate
- **Co-commute meeting point** (`friendsJourney.ts`) — evaluates every station between two
  people's origins and picks the one minimizing the difference in arrival times
- **Crowd simulation** (`crowdSimulation.ts`) — heuristic based on time of day, peak/off-peak
  windows, and known high-footfall stations (Charbagh interchange, Hazratganj CBD, Sachivalaya
  secretariat)
- **Card balance tracker** (`GoSmartCardContext.tsx`) — top-up and trip-deduction ledger with
  insufficient-balance protection, entirely client-side; deduction amounts are pulled straight
  from the route planner's calculated (and GoSmart-discounted) fare

### Theming
Light and dark mode share one set of design tokens (CSS custom properties in `index.css`),
swapped via a `.dark` class on `<html>`. An inline script in `index.html` applies the saved or
system-preferred theme before first paint, avoiding a flash of the wrong theme on load. System
preference changes are watched live while "System" is selected.

## 📋 Data Notes (v1)

- **Timetable**: No official UPMRC departure-time spreadsheet was available at build time, so
  train schedules are *generated* from the documented headway (5 min 30 sec peak / ~8 min
  off-peak) and operating hours (6 AM–10 PM). Segment-by-segment travel times are distributed
  proportionally to real station distances and calibrated to hit the official 40-minute
  end-to-end runtime exactly. Swapping in a real timetable later only requires changing
  `src/data/timetable.ts` — no UI code needs to change.
- **Route geometry**: `public/metroRoutes.geojson` connects stations in order (straight
  segments), not actual track curvature. Replace with an official/OSM-traced alignment for a
  more accurate map line.
- **Landmarks**: ~70 well-known Lucknow landmarks with pre-computed nearest-station distances.
  Expand `src/data/localPlaces.ts` over time — the shape is stable, so new entries are one line.
- **Blue Line**: Phase 1B (Charbagh ↔ Vasant Kunj) is under construction. Its data model,
  timing engine, and route-planning interchange logic are already wired up (`isWIP` flag) so
  flipping it to operational later is a data change, not a rewrite.
- **Card balance**: a manual ledger, not a connection to UPMRC's actual GoSmart Card system —
  there's no public API for that. You log top-ups and deduct trips yourself; the app does the
  bookkeeping and applies the GoSmart discount automatically.

## 🗺️ Future Roadmap

- 🛺 Multi-modal last-mile routing — combine metro legs with e-rickshaw/auto estimates for
  door-to-door journeys beyond walking distance of a station
- 🇮🇳 Hindi language support — UI string externalization + language toggle
- 📡 Real-time train API — replace the simulated headway-based timetable with live UPMRC data,
  if/when an official feed becomes available
- 📋 Live departure board — a default "next trains at my station" home view
- 🔔 Push notifications — "leave now" departure reminders
- ♿ Accessibility data — per-station lift/escalator availability
- ⭐ Favorites & recent journeys — save frequent routes (e.g. home ↔ work)
- 📢 Service alerts — manual or automated disruption/crowding notices
- 📈 ~1000-landmark coverage along the Red Line corridor (mall, schools, colleges, colonies)
- 🔁 Blue Line activation — flip `isWIP` once Phase 1B opens; routing and fare logic require
  no rewrite, only real station/timing data

## 🚢 Deployment & Environment Variables

### Vercel settings
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Node Version**: 18.x or later
- Security headers, asset caching, and SPA fallback routing are defined in `vercel.json` —
  no extra dashboard configuration needed.

### Environment variables / API keys
**None required.** LkoMetro has no backend and uses no paid or key-gated APIs:
- Map tiles are loaded from public OpenStreetMap tile servers (no key)
- Geolocation uses the browser's native `navigator.geolocation` API (no key)
- All station, fare, and timetable data is static and bundled at build time

If a real-time train data API is integrated in the future, its key would be added as a Vercel
environment variable (e.g. `VITE_UPMRC_API_KEY`) and referenced via `import.meta.env` — not
yet present in this version.

Any static host works equally well beyond Vercel — `npm run build` outputs to `dist/`.
