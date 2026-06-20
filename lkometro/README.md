# 🚇 LkoMetro — Lucknow Metro Companion App

An unofficial, full-featured companion web app for the Lucknow Metro Red Line: route planning
with live fares and timings, simulated live train tracking, offline station/landmark search,
a co-commute meeting-point tool, and crowd estimates — installable as a PWA and fully usable
offline.

> **Disclaimer:** This app does not represent a government entity. Timings and fares are
> sourced from the official [lucknow.upmetrorail.com](https://lucknow.upmetrorail.com/).

Built by **Astitva Bhardwaj** — [LinkedIn](https://www.linkedin.com/in/astitva-bhardwajlu/)

## Features

- 🗺️ Interactive Leaflet map of the Red Line (operational) and Blue Line (under construction)
- 🚆 Simulated live train positions, updated every 2 seconds
- 🧭 Route planner: fare, duration, next-train time, step-by-step journey
- 🔍 Offline fuzzy search across stations and ~70 Lucknow landmarks
- 👥 Co-commute tool — finds the best station for two people to meet
- 🟢 Crowd-level estimates by time of day and station
- 📴 Installable PWA, works fully offline once loaded
- 💳 GoSmart Card toggle (10% fare discount), Tourist Card info

## Tech stack

React 18 · TypeScript 5.7 (strict) · Vite 5 + SWC · Tailwind CSS · Radix UI primitives ·
Leaflet · vite-plugin-pwa / Workbox

## Getting started

```bash
npm install
npm run dev      # http://localhost:5000
npm run build    # production build to dist/
npm run preview  # preview the production build
```

## Project structure

```
src/
├── components/       UI components (map, route planner, dialogs, etc.)
│   └── ui/           Radix-based primitives (button, dialog, select, ...)
├── contexts/          GoSmartCardContext (fare discount, persisted)
├── data/              Stations, fares, timetable, crowd sim, landmarks
├── hooks/             use-mobile, use-online-status
├── lib/               routePlanner, stationSearch, friendsJourney, utils
└── pages/             Index (main app), NotFound
```

## Data notes (v1)

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

## Deployment

Configured for Vercel (`vercel.json`: security headers, asset caching, SPA fallback). Any
static host works equally well — `npm run build` outputs to `dist/`.
