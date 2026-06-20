export interface Station {
  id: string;
  name: string;
  coordinates: [number, number]; // [lat, lng]
  lines: ("red" | "blue")[];
  isUnderground?: boolean;
  isInterchange?: boolean;
  /** Work-in-progress / not yet operational (Blue Line, Phase 1B) */
  isWIP?: boolean;
}

// Line colors
export const LINE_COLORS = {
  red: "#9F1239", // Deep maroon — Red Line
  blue: "#1E5F8C", // Blue Line (under construction)
} as const;

export const LINE_NAMES = {
  red: "Red Line",
  blue: "Blue Line",
} as const;

// All 21 Red Line stations (operational) + 12 Blue Line stations (under construction)
export const stations: Record<string, Station> = {
  // ───────────────────────────── Red Line (North–South Corridor) ─────────────────────────────
  // CCS Airport → Munshipulia · 22.87 km · 21 stations · Operational since 8 March 2019
  ccs_airport: {
    id: "ccs_airport",
    name: "CCS Airport",
    coordinates: [26.7606, 80.8893],
    lines: ["red"],
  },
  amausi: {
    id: "amausi",
    name: "Amausi",
    coordinates: [26.7732, 80.8912],
    lines: ["red"],
  },
  transport_nagar: {
    id: "transport_nagar",
    name: "Transport Nagar",
    coordinates: [26.7859, 80.8942],
    lines: ["red"],
  },
  krishna_nagar: {
    id: "krishna_nagar",
    name: "Krishna Nagar",
    coordinates: [26.7956, 80.8985],
    lines: ["red"],
  },
  singar_nagar: {
    id: "singar_nagar",
    name: "Singar Nagar",
    coordinates: [26.8055, 80.9046],
    lines: ["red"],
  },
  alambagh: {
    id: "alambagh",
    name: "Alambagh",
    coordinates: [26.8137, 80.9105],
    lines: ["red"],
  },
  alambagh_bus_stand: {
    id: "alambagh_bus_stand",
    name: "Alambagh Bus Stand",
    coordinates: [26.8189, 80.9147],
    lines: ["red"],
  },
  mawaiya: {
    id: "mawaiya",
    name: "Mawaiya",
    coordinates: [26.8245, 80.9199],
    lines: ["red"],
  },
  durgapuri: {
    id: "durgapuri",
    name: "Durgapuri",
    coordinates: [26.8312, 80.9267],
    lines: ["red"],
  },
  charbagh: {
    id: "charbagh",
    name: "Charbagh",
    coordinates: [26.8358, 80.9229],
    lines: ["red", "blue"],
    isInterchange: true, // future Red ↔ Blue interchange once Blue Line opens
  },
  hussainganj: {
    id: "hussainganj",
    name: "Hussainganj",
    coordinates: [26.8438, 80.9373],
    lines: ["red"],
    isUnderground: true,
  },
  sachivalaya: {
    id: "sachivalaya",
    name: "Sachivalaya",
    coordinates: [26.849, 80.9428],
    lines: ["red"],
    isUnderground: true,
  },
  hazratganj: {
    id: "hazratganj",
    name: "Hazratganj",
    coordinates: [26.852, 80.9477],
    lines: ["red"],
    isUnderground: true,
  },
  kd_singh_babu_stadium: {
    id: "kd_singh_babu_stadium",
    name: "KD Singh Babu Stadium",
    coordinates: [26.8555, 80.9527],
    lines: ["red"],
  },
  vishvavidyalaya: {
    id: "vishvavidyalaya",
    name: "Vishvavidyalaya",
    coordinates: [26.8595, 80.9527],
    lines: ["red"],
  },
  it_chauraha: {
    id: "it_chauraha",
    name: "IT Chauraha",
    coordinates: [26.8648, 80.9511],
    lines: ["red"],
  },
  badshah_nagar: {
    id: "badshah_nagar",
    name: "Badshah Nagar",
    coordinates: [26.8701, 80.9489],
    lines: ["red"],
  },
  lekhraj_market: {
    id: "lekhraj_market",
    name: "Lekhraj Market",
    coordinates: [26.87, 80.956],
    lines: ["red"],
  },
  bhootnath_market: {
    id: "bhootnath_market",
    name: "Bhootnath Market",
    coordinates: [26.8694, 80.9645],
    lines: ["red"],
  },
  indira_nagar: {
    id: "indira_nagar",
    name: "Indira Nagar",
    coordinates: [26.8744, 80.9725],
    lines: ["red"],
  },
  munshipulia: {
    id: "munshipulia",
    name: "Munshipulia",
    coordinates: [26.8789, 80.9785],
    lines: ["red"],
  },

  // ───────────────────────────── Blue Line (East–West Corridor, Phase 1B) ─────────────────────────────
  // Charbagh → Vasant Kunj · 11.17 km · 12 stations · Under construction (target ~2029)
  // Coordinates are approximate, interpolated along the known route corridor; refine once
  // official alignment/GeoJSON is published by UPMRC.
  pandeyganj: {
    id: "pandeyganj",
    name: "Pandeyganj",
    coordinates: [26.8389, 80.9145],
    lines: ["blue"],
    isWIP: true,
  },
  aminabad: {
    id: "aminabad",
    name: "Aminabad",
    coordinates: [26.8465, 80.9115],
    lines: ["blue"],
    isWIP: true,
  },
  gautam_buddha_marg: {
    id: "gautam_buddha_marg",
    name: "Gautam Buddha Marg",
    coordinates: [26.8541, 80.909],
    lines: ["blue"],
    isWIP: true,
  },
  durgapuri_blue: {
    id: "durgapuri_blue",
    name: "Durgapuri (Blue)",
    coordinates: [26.8612, 80.906],
    lines: ["blue"],
    isWIP: true,
  },
  lucknow_city_railway_station: {
    id: "lucknow_city_railway_station",
    name: "Lucknow City Rly Stn",
    coordinates: [26.833, 80.918],
    lines: ["blue"],
    isWIP: true,
  },
  medical_college_crossing: {
    id: "medical_college_crossing",
    name: "Medical College Crossing",
    coordinates: [26.8685, 80.902],
    lines: ["blue"],
    isWIP: true,
  },
  nawajganj: {
    id: "nawajganj",
    name: "Nawajganj",
    coordinates: [26.875, 80.8975],
    lines: ["blue"],
    isWIP: true,
  },
  thakurganj: {
    id: "thakurganj",
    name: "Thakurganj",
    coordinates: [26.881, 80.892],
    lines: ["blue"],
    isWIP: true,
  },
  balaganj: {
    id: "balaganj",
    name: "Balaganj",
    coordinates: [26.8865, 80.8865],
    lines: ["blue"],
    isWIP: true,
  },
  musabagh: {
    id: "musabagh",
    name: "Musabagh",
    coordinates: [26.892, 80.8805],
    lines: ["blue"],
    isWIP: true,
  },
  vasant_kunj: {
    id: "vasant_kunj",
    name: "Vasant Kunj",
    coordinates: [26.8975, 80.8745],
    lines: ["blue"],
    isWIP: true,
  },
};

// Ordered station ID lists per line (terminal to terminal) — single source of truth
// for pathfinding, fare calc, and map polylines.
export const LINE_STATIONS: Record<"red" | "blue", string[]> = {
  red: [
    "ccs_airport",
    "amausi",
    "transport_nagar",
    "krishna_nagar",
    "singar_nagar",
    "alambagh",
    "alambagh_bus_stand",
    "mawaiya",
    "durgapuri",
    "charbagh",
    "hussainganj",
    "sachivalaya",
    "hazratganj",
    "kd_singh_babu_stadium",
    "vishvavidyalaya",
    "it_chauraha",
    "badshah_nagar",
    "lekhraj_market",
    "bhootnath_market",
    "indira_nagar",
    "munshipulia",
  ],
  blue: [
    "charbagh",
    "pandeyganj",
    "aminabad",
    "gautam_buddha_marg",
    "durgapuri_blue",
    "lucknow_city_railway_station",
    "medical_college_crossing",
    "nawajganj",
    "thakurganj",
    "balaganj",
    "musabagh",
    "vasant_kunj",
  ],
};

export const LINE_TERMINALS: Record<"red" | "blue", { start: string; end: string }> = {
  red: { start: "CCS Airport", end: "Munshipulia" },
  blue: { start: "Charbagh", end: "Vasant Kunj" },
};

export const getStationOptions = (includeWIP = false): Station[] =>
  Object.values(stations)
    .filter((s) => includeWIP || !s.isWIP)
    .sort((a, b) => a.name.localeCompare(b.name));

export const getOrganizedStations = (): {
  line: "red" | "blue";
  lineName: string;
  stations: Station[];
}[] => {
  return (Object.keys(LINE_STATIONS) as ("red" | "blue")[]).map((line) => ({
    line,
    lineName: LINE_NAMES[line],
    stations: LINE_STATIONS[line].map((id) => stations[id]).filter(Boolean),
  }));
};
