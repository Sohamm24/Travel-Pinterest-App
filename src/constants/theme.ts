/**
 * constants/theme.ts
 * ──────────────────
 * Static design tokens from UI & UX Design Specification.
 * These are the "light mode defaults" used by screens that
 * haven't yet migrated to useTheme().colors.
 */

export const COLORS = {
  primary: '#2E1065',       // Violet 950 (Banners/Buttons)
  secondary: '#8B5CF6',     // Violet 500 (Nav/Clickable Icons)
  ternary: '#C4B5FD',       // Violet 300 (Background Boxes)
  dim: '#EBE7FA',           // Soft violet background
  confirmation: '#14532D',  // Green 900 (Confirmation Action)
  iconDisabled: '#2563EB',  // Blue 600 (Non-clickable Icons)
  textPrimary: '#262626',   // Neutral 800 (Important Text / Headings)
  textSecondary: '#404040', // Neutral 700 (Supporting Text)
  bannerText: '#C09E67',
  background: '#FFFFFF',
  surface: '#F5F5F5',
  card: '#F9FAFB',
  border: '#E5E7EB',
  error: '#DC2626',         // Red 600
  primaryDim: 'rgba(139,92,246,0.12)',
  overlay: 'rgba(0,0,0,0.45)',
};

export const TYPOGRAPHY = {
  fontFamily: 'PlusJakartaSans_400Regular',
  fontFamilyBold: 'PlusJakartaSans_700Bold',
  fontFamilySemiBold: 'PlusJakartaSans_600SemiBold',
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
};

export const SHAPES = {
  roundedSmall: 8,
  roundedMedium: 16,
  roundedLarge: 24,
  roundedFull: 9999,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const ANIMATION = {
  fast: 150,
  medium: 300,
  slow: 500,
};
