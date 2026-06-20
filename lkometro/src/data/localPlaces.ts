export interface LocalPlace {
  id: string;
  name: string;
  category:
    | "heritage"
    | "shopping"
    | "park"
    | "education"
    | "hospital"
    | "transport"
    | "civic"
    | "religious"
    | "entertainment"
    | "sports";
  coordinates: [number, number];
  nearestStationId: string;
  distanceKm: number;
}

/**
 * Starter landmark database for "nearest station" search (v1: ~80 well-known
 * Lucknow landmarks — heritage sites, markets, malls, hospitals, parks, civic
 * buildings). Distances are pre-computed (haversine, straight-line) so search
 * works fully offline with zero runtime geocoding. Expand this list over time;
 * the shape is stable so new entries are a one-line addition.
 */
export const localPlaces: LocalPlace[] = [
  { id: "bara_imambara", name: "Bara Imambara", category: "heritage", coordinates: [26.8693, 80.9119], nearestStationId: "badshah_nagar", distanceKm: 3.67 },
  { id: "chota_imambara", name: "Chota Imambara", category: "heritage", coordinates: [26.8665, 80.9097], nearestStationId: "charbagh", distanceKm: 3.66 },
  { id: "rumi_darwaza", name: "Rumi Darwaza", category: "heritage", coordinates: [26.8682, 80.9108], nearestStationId: "hussainganj", distanceKm: 3.78 },
  { id: "lucknow_residency_british_residency", name: "Lucknow Residency (British Residency)", category: "heritage", coordinates: [26.8616, 80.9252], nearestStationId: "sachivalaya", distanceKm: 2.24 },
  { id: "hazratganj_market", name: "Hazratganj Market", category: "shopping", coordinates: [26.852, 80.9477], nearestStationId: "hazratganj", distanceKm: 0.0 },
  { id: "janeshwar_mishra_park", name: "Janeshwar Mishra Park", category: "park", coordinates: [26.859, 80.9963], nearestStationId: "munshipulia", distanceKm: 2.83 },
  { id: "ambedkar_memorial_park", name: "Ambedkar Memorial Park", category: "park", coordinates: [26.8425, 80.965], nearestStationId: "kd_singh_babu_stadium", distanceKm: 1.89 },
  { id: "dr_ram_manohar_lohia_park", name: "Dr. Ram Manohar Lohia Park", category: "park", coordinates: [26.855, 80.958], nearestStationId: "kd_singh_babu_stadium", distanceKm: 0.53 },
  { id: "kukrail_forest_reserve", name: "Kukrail Forest Reserve", category: "park", coordinates: [26.878, 80.995], nearestStationId: "munshipulia", distanceKm: 1.64 },
  { id: "sikandar_bagh", name: "Sikandar Bagh", category: "heritage", coordinates: [26.8541, 80.9362], nearestStationId: "sachivalaya", distanceKm: 0.87 },
  { id: "la_martiniere_college", name: "La Martiniere College", category: "education", coordinates: [26.8366, 80.9263], nearestStationId: "charbagh", distanceKm: 0.35 },
  { id: "lucknow_university", name: "Lucknow University", category: "education", coordinates: [26.8606, 80.952], nearestStationId: "vishvavidyalaya", distanceKm: 0.14 },
  { id: "king_georges_medical_university_kgmu", name: "King George's Medical University (KGMU)", category: "hospital", coordinates: [26.8569, 80.9304], nearestStationId: "sachivalaya", distanceKm: 1.51 },
  { id: "sgpgi_sanjay_gandhi_pgi", name: "SGPGI (Sanjay Gandhi PGI)", category: "hospital", coordinates: [26.7494, 80.9482], nearestStationId: "ccs_airport", distanceKm: 5.98 },
  { id: "charbagh_railway_station", name: "Charbagh Railway Station", category: "transport", coordinates: [26.8302, 80.9219], nearestStationId: "durgapuri", distanceKm: 0.49 },
  { id: "ccs_international_airport", name: "CCS International Airport", category: "transport", coordinates: [26.7606, 80.8893], nearestStationId: "ccs_airport", distanceKm: 0.0 },
  { id: "alambagh_bus_station", name: "Alambagh Bus Station", category: "transport", coordinates: [26.8189, 80.9147], nearestStationId: "alambagh_bus_stand", distanceKm: 0.0 },
  { id: "kaiserbagh", name: "Kaiserbagh", category: "heritage", coordinates: [26.8482, 80.927], nearestStationId: "hussainganj", distanceKm: 1.13 },
  { id: "gpo_lucknow_hazratganj", name: "GPO Lucknow (Hazratganj)", category: "civic", coordinates: [26.8519, 80.9445], nearestStationId: "hazratganj", distanceKm: 0.32 },
  { id: "up_vidhan_sabha_legislative_assembly", name: "UP Vidhan Sabha (Legislative Assembly)", category: "civic", coordinates: [26.8512, 80.9418], nearestStationId: "sachivalaya", distanceKm: 0.26 },
  { id: "up_secretariat_bapu_bhawan", name: "UP Secretariat (Bapu Bhawan)", category: "civic", coordinates: [26.849, 80.9428], nearestStationId: "sachivalaya", distanceKm: 0.0 },
  { id: "moti_mahal_park", name: "Moti Mahal Park", category: "park", coordinates: [26.858, 80.918], nearestStationId: "hussainganj", distanceKm: 2.48 },
  { id: "phoenix_palassio_mall", name: "Phoenix Palassio Mall", category: "shopping", coordinates: [26.8568, 80.9885], nearestStationId: "indira_nagar", distanceKm: 2.52 },
  { id: "wave_mall_sahara_ganj", name: "Wave Mall (Sahara Ganj)", category: "shopping", coordinates: [26.8537, 80.946], nearestStationId: "hazratganj", distanceKm: 0.25 },
  { id: "fun_republic_mall_gomti_nagar", name: "Fun Republic Mall, Gomti Nagar", category: "shopping", coordinates: [26.852, 80.997], nearestStationId: "indira_nagar", distanceKm: 3.48 },
  { id: "riverside_mall_faizabad_road", name: "Riverside Mall, Faizabad Road", category: "shopping", coordinates: [26.887, 80.987], nearestStationId: "munshipulia", distanceKm: 1.23 },
  { id: "lulu_mall_lucknow", name: "Lulu Mall Lucknow", category: "shopping", coordinates: [26.843, 81.0], nearestStationId: "indira_nagar", distanceKm: 4.43 },
  { id: "phoenix_marketcity", name: "Phoenix Marketcity", category: "shopping", coordinates: [26.855, 81.001], nearestStationId: "munshipulia", distanceKm: 3.47 },
  { id: "amausi_industrial_area", name: "Amausi Industrial Area", category: "civic", coordinates: [26.772, 80.893], nearestStationId: "amausi", distanceKm: 0.22 },
  { id: "transport_nagar_mandi", name: "Transport Nagar Mandi", category: "shopping", coordinates: [26.7859, 80.8942], nearestStationId: "transport_nagar", distanceKm: 0.0 },
  { id: "alambagh_stadium", name: "Alambagh Stadium", category: "sports", coordinates: [26.817, 80.908], nearestStationId: "alambagh", distanceKm: 0.44 },
  { id: "eco_garden_lucknow", name: "Eco Garden, Lucknow", category: "park", coordinates: [26.873, 80.992], nearestStationId: "munshipulia", distanceKm: 1.49 },
  { id: "lucknow_zoo_prince_of_wales_zoological_garden", name: "Lucknow Zoo (Prince of Wales Zoological Garden)", category: "park", coordinates: [26.8482, 80.9362], nearestStationId: "hussainganj", distanceKm: 0.5 },
  { id: "state_museum_lucknow", name: "State Museum Lucknow", category: "heritage", coordinates: [26.848, 80.9355], nearestStationId: "hussainganj", distanceKm: 0.5 },
  { id: "buddha_park_lucknow", name: "Buddha Park, Lucknow", category: "park", coordinates: [26.8478, 80.937], nearestStationId: "hussainganj", distanceKm: 0.45 },
  { id: "begum_hazrat_mahal_park", name: "Begum Hazrat Mahal Park", category: "park", coordinates: [26.853, 80.942], nearestStationId: "sachivalaya", distanceKm: 0.45 },
  { id: "gpo_park", name: "GPO Park", category: "park", coordinates: [26.8525, 80.944], nearestStationId: "hazratganj", distanceKm: 0.37 },
  { id: "mayfair_cinema_hazratganj", name: "Mayfair Cinema, Hazratganj", category: "entertainment", coordinates: [26.8513, 80.946], nearestStationId: "hazratganj", distanceKm: 0.19 },
  { id: "capitol_cinema_hazratganj", name: "Capitol Cinema, Hazratganj", category: "entertainment", coordinates: [26.8515, 80.9465], nearestStationId: "hazratganj", distanceKm: 0.13 },
  { id: "saharaganj_mall", name: "Saharaganj Mall", category: "shopping", coordinates: [26.8537, 80.946], nearestStationId: "hazratganj", distanceKm: 0.25 },
  { id: "aminabad_market", name: "Aminabad Market", category: "shopping", coordinates: [26.8465, 80.9265], nearestStationId: "hussainganj", distanceKm: 1.11 },
  { id: "chowk_market", name: "Chowk Market", category: "shopping", coordinates: [26.8645, 80.9095], nearestStationId: "charbagh", distanceKm: 3.46 },
  { id: "nakhas_market", name: "Nakhas Market", category: "shopping", coordinates: [26.87, 80.907], nearestStationId: "charbagh", distanceKm: 4.12 },
  { id: "akbari_gate", name: "Akbari Gate", category: "heritage", coordinates: [26.865, 80.908], nearestStationId: "charbagh", distanceKm: 3.57 },
  { id: "dargah_hazrat_abbas", name: "Dargah Hazrat Abbas", category: "religious", coordinates: [26.843, 80.9145], nearestStationId: "charbagh", distanceKm: 1.16 },
  { id: "teele_wali_masjid", name: "Teele Wali Masjid", category: "religious", coordinates: [26.873, 80.899], nearestStationId: "charbagh", distanceKm: 4.77 },
  { id: "lucknow_haat_mahotsav_ground", name: "Lucknow Haat (Mahotsav Ground)", category: "shopping", coordinates: [26.8505, 80.9985], nearestStationId: "indira_nagar", distanceKm: 3.7 },
  { id: "gomti_riverfront_park", name: "Gomti Riverfront Park", category: "park", coordinates: [26.856, 80.9595], nearestStationId: "kd_singh_babu_stadium", distanceKm: 0.68 },
  { id: "hanuman_setu_temple", name: "Hanuman Setu Temple", category: "religious", coordinates: [26.854, 80.943], nearestStationId: "hazratganj", distanceKm: 0.52 },
  { id: "aishbagh_ramlila_ground", name: "Aishbagh Ramlila Ground", category: "civic", coordinates: [26.833, 80.913], nearestStationId: "charbagh", distanceKm: 1.03 },
  { id: "aishbagh_railway_station", name: "Aishbagh Railway Station", category: "transport", coordinates: [26.832, 80.91], nearestStationId: "mawaiya", distanceKm: 1.29 },
  { id: "naka_hindola", name: "Naka Hindola", category: "civic", coordinates: [26.84, 80.912], nearestStationId: "charbagh", distanceKm: 1.18 },
  { id: "daliganj", name: "Daliganj", category: "civic", coordinates: [26.865, 80.923], nearestStationId: "badshah_nagar", distanceKm: 2.63 },
  { id: "up_police_headquarters", name: "UP Police Headquarters", category: "civic", coordinates: [26.847, 80.9445], nearestStationId: "sachivalaya", distanceKm: 0.28 },
  { id: "lucknow_mahanagar", name: "Lucknow Mahanagar", category: "civic", coordinates: [26.865, 80.97], nearestStationId: "bhootnath_market", distanceKm: 0.73 },
  { id: "indira_gandhi_pratishthan", name: "Indira Gandhi Pratishthan", category: "entertainment", coordinates: [26.846, 80.955], nearestStationId: "hazratganj", distanceKm: 0.98 },
  { id: "rml_institute_of_medical_sciences", name: "RML Institute of Medical Sciences", category: "hospital", coordinates: [26.858, 80.957], nearestStationId: "vishvavidyalaya", distanceKm: 0.46 },
  { id: "vrindavan_yojana", name: "Vrindavan Yojana", category: "civic", coordinates: [26.885, 80.987], nearestStationId: "munshipulia", distanceKm: 1.08 },
  { id: "kapoorthala", name: "Kapoorthala", category: "civic", coordinates: [26.864, 80.946], nearestStationId: "it_chauraha", distanceKm: 0.51 },
  { id: "vivekananda_polyclinic", name: "Vivekananda Polyclinic", category: "hospital", coordinates: [26.86, 80.958], nearestStationId: "vishvavidyalaya", distanceKm: 0.53 },
  { id: "avadh_shilp_gram", name: "Avadh Shilp Gram", category: "shopping", coordinates: [26.858, 80.992], nearestStationId: "indira_nagar", distanceKm: 2.66 },
  { id: "shaheed_smarak", name: "Shaheed Smarak", category: "heritage", coordinates: [26.848, 80.936], nearestStationId: "hussainganj", distanceKm: 0.48 },
  { id: "lucknow_cantonment", name: "Lucknow Cantonment", category: "civic", coordinates: [26.833, 80.936], nearestStationId: "durgapuri", distanceKm: 0.94 },
  { id: "cms_aliganj", name: "CMS Aliganj", category: "education", coordinates: [26.887, 80.946], nearestStationId: "badshah_nagar", distanceKm: 1.9 },
  { id: "aliganj_market", name: "Aliganj Market", category: "shopping", coordinates: [26.885, 80.945], nearestStationId: "badshah_nagar", distanceKm: 1.7 },
  { id: "indira_nagar_stadium", name: "Indira Nagar Stadium", category: "sports", coordinates: [26.877, 80.97], nearestStationId: "indira_nagar", distanceKm: 0.38 },
  { id: "polytechnic_chauraha", name: "Polytechnic Chauraha", category: "civic", coordinates: [26.864, 80.952], nearestStationId: "it_chauraha", distanceKm: 0.13 },
  { id: "lucknow_press_club", name: "Lucknow Press Club", category: "civic", coordinates: [26.854, 80.945], nearestStationId: "hazratganj", distanceKm: 0.35 },
];
/** Fuzzy, case-insensitive substring search across landmark names. */
export const searchLocalPlaces = (query: string, limit = 8): LocalPlace[] => {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return localPlaces
    .filter((p) => p.name.toLowerCase().includes(q))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);
};

export const getPlacesByCategory = (category: LocalPlace["category"]): LocalPlace[] =>
  localPlaces.filter((p) => p.category === category);

export const CATEGORY_LABELS: Record<LocalPlace["category"], string> = {
  heritage: "Heritage & Monuments",
  shopping: "Shopping & Markets",
  park: "Parks & Gardens",
  education: "Education",
  hospital: "Hospitals",
  transport: "Transport Hubs",
  civic: "Civic & Government",
  religious: "Religious Sites",
  entertainment: "Entertainment",
  sports: "Sports",
};
