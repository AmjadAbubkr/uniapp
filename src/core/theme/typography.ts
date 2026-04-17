import { Platform, TextStyle } from 'react-native';

export const Typography: Record<string, TextStyle> = {
  titleLarge: {
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 0,
  },
  titleMedium: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.15,
  },
  bodyLarge: {
    fontSize: 16,
    fontWeight: 'normal',
    letterSpacing: 0.5,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: 'normal',
    letterSpacing: 0.25,
  },
  labelLarge: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
};

const typography = {
  fonts: {
    // We'll configure these explicitly by relying on Google Fonts (already added to assets later or React Native handled)
    // Assuming standard React Native linking for Plus Jakarta Sans and Tajawal
    latin: 'PlusJakartaSans-Regular',
    latinMedium: 'PlusJakartaSans-Medium',
    latinBold: 'PlusJakartaSans-Bold',
    latinExtraBold: 'PlusJakartaSans-ExtraBold',

    arabic: 'Tajawal-Regular',
    arabicMedium: 'Tajawal-Medium',
    arabicBold: 'Tajawal-Bold',
    arabicExtraBold: 'Tajawal-ExtraBold',
  },

  sizes: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 24,
    display: 32,
  },

  letterSpacings: {
    tight: -0.5,
    normal: 0,
    wide: 1.5, // for labels (+0.05em equivalent visually)
  },
};
