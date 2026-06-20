/**
 * Hand-built SVG icon set for LkoMetro — train markers and station glyphs.
 * Designed to read clearly at small map-marker sizes (16–28px) and to be
 * colorable via props (not hardcoded fills) so they work across light/dark
 * mode and per-line theming.
 */

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

/** A compact, top-down train glyph — rounded front, two window bands, used for live train markers. */
export const TrainIcon = ({ size = 20, color = "#9F1239", className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="4" y="5" width="16" height="13" rx="4" fill={color} />
    <rect x="6.5" y="7.5" width="4.5" height="3.5" rx="1" fill="white" fillOpacity="0.92" />
    <rect x="13" y="7.5" width="4.5" height="3.5" rx="1" fill="white" fillOpacity="0.92" />
    <rect x="6.5" y="13" width="11" height="1.6" rx="0.8" fill="white" fillOpacity="0.55" />
    <circle cx="8" cy="19.2" r="1.3" fill={color} />
    <circle cx="16" cy="19.2" r="1.3" fill={color} />
  </svg>
);

/** Generic station dot with a white ring — used for regular at-grade/elevated stations. */
export const StationIcon = ({ size = 16, color = "#9F1239", className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="8" cy="8" r="6.5" fill={color} stroke="white" strokeWidth="2" />
  </svg>
);

/** Underground station — same dot plus a small downward chevron to signal "below ground". */
export const UndergroundStationIcon = ({ size = 18, color = "#9F1239", className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="9" cy="7.5" r="6" fill={color} stroke="white" strokeWidth="2" />
    <path d="M6.5 9.5L9 12L11.5 9.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Interchange station — larger ring with a gold center, signaling "lines meet here". */
export const InterchangeStationIcon = ({ size = 22, color = "#F5C518", className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="11" cy="11" r="9" fill="white" stroke={color} strokeWidth="2.5" />
    <circle cx="11" cy="11" r="4" fill={color} />
  </svg>
);

/** Small directional arrow used in train tooltips/popups to indicate direction of travel. */
export const DirectionArrowIcon = ({ size = 14, color = "currentColor", className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
