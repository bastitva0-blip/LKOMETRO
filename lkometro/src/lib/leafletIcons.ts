/**
 * Raw SVG-string versions of src/components/icons/MetroIcons.tsx, for use
 * inside Leaflet's L.divIcon (which renders raw HTML, not React). Keep the
 * visual design in sync with the React versions if either changes.
 */

export const trainIconSvg = (color = "#9F1239"): string => `
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="5" width="16" height="13" rx="4" fill="${color}" stroke="white" stroke-width="1.5"/>
    <rect x="6.5" y="7.5" width="4.5" height="3.5" rx="1" fill="white" fill-opacity="0.92"/>
    <rect x="13" y="7.5" width="4.5" height="3.5" rx="1" fill="white" fill-opacity="0.92"/>
    <rect x="6.5" y="13" width="11" height="1.6" rx="0.8" fill="white" fill-opacity="0.55"/>
    <circle cx="8" cy="19.2" r="1.3" fill="${color}"/>
    <circle cx="16" cy="19.2" r="1.3" fill="${color}"/>
  </svg>
`;

export const stationIconSvg = (color: string, size = 16): string => `
  <svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="6.5" fill="${color}" stroke="white" stroke-width="2"/>
  </svg>
`;

export const undergroundStationIconSvg = (color: string, size = 18): string => `
  <svg width="${size}" height="${size}" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="7.5" r="6" fill="${color}" stroke="white" stroke-width="2"/>
    <path d="M6.5 9.5L9 12L11.5 9.5" stroke="white" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`;

export const interchangeStationIconSvg = (color = "#F5C518", size = 22): string => `
  <svg width="${size}" height="${size}" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="9" fill="white" stroke="${color}" stroke-width="2.5"/>
    <circle cx="11" cy="11" r="4" fill="${color}"/>
  </svg>
`;
