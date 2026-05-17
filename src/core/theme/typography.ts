import { TextStyle } from 'react-native';

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

export default Typography;
