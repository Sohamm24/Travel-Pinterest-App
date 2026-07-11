/**
 * constants/colors.ts
 * ────────────────────
 * Violet-based palette per UI & UX Design Specification.
 * Primary: Violet 950 · Secondary: Violet 500 · Ternary: Violet 300
 */

export const lightColors = {
  // Core palette
  primary: '#2E1065',       // Violet 950 — Banners & primary buttons
  secondary: '#8B5CF6',     // Violet 500 — Nav & clickable icons
  ternary: '#C4B5FD',       // Violet 300 — Background boxes
  dim: '#EBE7FA',           // Violet tint — Soft backgrounds

  // Semantic
  confirmation: '#14532D',  // Green 900 — Confirm actions
  iconDisabled: '#2563EB',  // Blue 600 — Non-clickable icons
  error: '#DC2626',         // Red 600

  // Surfaces
  background: '#FFFFFF',
  surface: '#F5F5F5',
  card: '#F9FAFB',
  headerBg: '#FFFFFF',

  // Text
  textPrimary: '#262626',   // Neutral 800 — Titles & important text
  textSecondary: '#404040', // Neutral 700 — Supporting text
  bannerText: '#C09E67',
  banner:'#ffffffff',

  // Misc
  border: '#E5E7EB',
  skeleton: '#E9ECEF',
  skeletonHighlight: '#F8F9FA',
  overlay: 'rgba(0,0,0,0.45)',
  badgeBg: 'rgba(255,255,255,0.92)',
  badgeText: '#262626',
  progressBg: 'rgba(139,92,246,0.15)',
  primaryDim: 'rgba(139,92,246,0.12)',
};

export const darkColors = {
  // Core palette (violet tones stay vivid in dark mode)
  primary: '#A78BFA',       // Violet 400 — stays readable on dark bg
  secondary: '#8B5CF6',     // Violet 500
  ternary: '#4C1D95',       // Violet 900 — dark tint boxes
  dim: '#1E1033',           // Very dark violet

  // Semantic
  confirmation: '#22C55E',  // Green 500 — readable on dark
  iconDisabled: '#60A5FA',  // Blue 400
  error: '#EF4444',

  // Surfaces
  background: '#141414ff',
  surface: '#141414',
  card: '#1A1A1A',
  headerBg: '#0A0A0A',

  // Text
  textPrimary: '#F3F4F6',   // Neutral 100
  textSecondary: '#9CA3AF', // Neutral 400
  bannerText: '#C09E67',
  banner:'#141414ff',

  // Misc
  border: '#272727',
  skeleton: '#1A1A1A',
  skeletonHighlight: '#262626',
  overlay: 'rgba(0,0,0,0.6)',
  badgeBg: 'rgba(0,0,0,0.75)',
  badgeText: '#F3F4F6',
  progressBg: 'rgba(167,139,250,0.12)',
  primaryDim: 'rgba(167,139,250,0.12)',
};

export type ColorPalette = typeof lightColors;
