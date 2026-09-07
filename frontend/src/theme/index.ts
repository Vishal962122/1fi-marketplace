/**
 * Design tokens — tuned to the live 1Fi app (app.1fi.in).
 *
 * 1Fi's identity: violet primary, light-lavender page background, white rounded
 * cards with a soft shadow, pill controls, a floating bottom nav. Keeping every
 * value here means the Marketplace screens stay pixel-consistent with Shop.
 */

export const colors = {
  // Brand
  primary: '#6D3AED',
  primaryDark: '#4C1D95',
  primaryPressed: '#5B2BD0',
  primarySoft: '#F1ECFE', // toggle track, icon chips, badges
  primaryTint: '#F8F6FF', // faint fills

  // Surfaces
  background: '#FFFFFF', // cards
  surface: '#F6F4FD', // page background (lavender)
  surfaceAlt: '#EEEAFB',

  // Text
  text: '#17131F',
  textMuted: '#6B6577',
  textFaint: '#9A94A6',
  textInverse: '#FFFFFF',

  // Lines
  border: '#ECE8F6',
  divider: '#F0EDF7',

  // Status
  success: '#12B76A',
  successSoft: '#E7F6EE',
  warning: '#F79009',
  danger: '#F04438',
  dangerSoft: '#FDECEA',

  skeleton: '#EEEBF6',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radii = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  pill: 999,
} as const;

/** Font families are registered in src/theme/fonts.ts via expo-font. */
export const fontFamily = {
  regular: 'Jakarta_400Regular',
  medium: 'Jakarta_500Medium',
  semibold: 'Jakarta_600SemiBold',
  bold: 'Jakarta_700Bold',
} as const;

export const typography = {
  display: { fontFamily: fontFamily.bold, fontSize: 28, lineHeight: 34 },
  h1: { fontFamily: fontFamily.bold, fontSize: 22, lineHeight: 28 },
  h2: { fontFamily: fontFamily.semibold, fontSize: 17, lineHeight: 22 },
  h3: { fontFamily: fontFamily.semibold, fontSize: 15, lineHeight: 20 },
  body: { fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 20 },
  bodyStrong: { fontFamily: fontFamily.semibold, fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: fontFamily.regular, fontSize: 12.5, lineHeight: 17 },
  captionStrong: { fontFamily: fontFamily.semibold, fontSize: 12.5, lineHeight: 17 },
  overline: {
    fontFamily: fontFamily.bold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
} as const;

export type TypographyVariant = keyof typeof typography;

export const shadow = {
  card: {
    shadowColor: '#3A1D8A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  nav: {
    shadowColor: '#3A1D8A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
} as const;
