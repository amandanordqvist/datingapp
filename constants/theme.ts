// Common colors used across both themes
export const COMMON_COLORS = {
  primary: '#FF1493',
  secondary: '#9342F5',
  success: '#10B981',
  warning: '#FBBF24',
  error: '#EF4444',
  gray: {
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  like: '#43D854',
  dislike: '#FE3C72',
  superlike: '#00E1FF',
};

// Dark theme colors
export const DARK_COLORS = {
  primary: COMMON_COLORS.primary,
  secondary: COMMON_COLORS.secondary,
  success: COMMON_COLORS.success,
  warning: COMMON_COLORS.warning,
  error: COMMON_COLORS.error,
  gray: COMMON_COLORS.gray,
  background: {
    primary: '#171717',
    secondary: '#1F1F1F',
    tertiary: '#2A2A2A',
    highlight: 'rgba(255, 20, 147, 0.1)',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#9CA3AF',
    tertiary: '#6B7280',
  },
  border: '#2D2D2D',
  card: '#1F1F1F',
  interactive: {
    like: COMMON_COLORS.like,
    dislike: COMMON_COLORS.dislike,
    superlike: COMMON_COLORS.superlike,
  }
};

// Light theme colors
export const LIGHT_COLORS = {
  primary: COMMON_COLORS.primary,
  secondary: COMMON_COLORS.secondary,
  success: COMMON_COLORS.success,
  warning: COMMON_COLORS.warning,
  error: COMMON_COLORS.error,
  gray: COMMON_COLORS.gray,
  background: {
    primary: '#F5F5F5',
    secondary: '#FFFFFF',
    tertiary: '#EFEFEF',
    highlight: 'rgba(255, 20, 147, 0.1)',
  },
  text: {
    primary: '#333333',
    secondary: '#666666',
    tertiary: '#999999',
  },
  border: '#EEEEEE',
  card: '#FFFFFF',
  interactive: {
    like: COMMON_COLORS.like,
    dislike: COMMON_COLORS.dislike,
    superlike: COMMON_COLORS.superlike,
  }
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FONT_SIZE = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const FONT_WEIGHTS = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  extrabold: '800',
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
};

// Create theme objects for light and dark mode
export const lightTheme = {
  colors: LIGHT_COLORS,
  spacing: SPACING,
  fontSize: FONT_SIZE,
  fontWeight: FONT_WEIGHTS,
  borderRadius: BORDER_RADIUS,
  shadows: SHADOWS,
  isDark: false,
};

export const darkTheme = {
  colors: DARK_COLORS,
  spacing: SPACING,
  fontSize: FONT_SIZE,
  fontWeight: FONT_WEIGHTS,
  borderRadius: BORDER_RADIUS,
  shadows: SHADOWS,
  isDark: true,
};

export default { lightTheme, darkTheme }; 