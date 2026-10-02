import { DarkTheme as NavDarkTheme, DefaultTheme as NavLightTheme, type Theme as NavTheme } from 'expo-router/react-navigation';
import { MD3DarkTheme, MD3LightTheme, useTheme, type MD3Theme } from 'react-native-paper';

type AppColors = MD3Theme['colors'] & {
  success: string;
  warning: string;
  chartBar: string;
  chartBarMuted: string;
};

export type AppTheme = MD3Theme & { colors: AppColors };

export const lightTheme: AppTheme = {
  ...MD3LightTheme,
  roundness: 3,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1A5FD0',
    onPrimary: '#FFFFFF',
    primaryContainer: '#DAE2FF',
    onPrimaryContainer: '#001946',
    secondaryContainer: '#DCE2F9',
    onSecondaryContainer: '#151B2C',
    background: '#F6F7FB',
    surface: '#FFFFFF',
    surfaceVariant: '#E1E2EC',
    onSurfaceVariant: '#44474F',
    outline: '#757780',
    outlineVariant: '#C5C6D0',
    elevation: { ...MD3LightTheme.colors.elevation, level1: '#FFFFFF', level2: '#F0F2FA' },
    success: '#1B7F3B',
    warning: '#9A6200',
    chartBar: '#1A5FD0',
    chartBarMuted: '#C9D6F5',
  },
};

export const darkTheme: AppTheme = {
  ...MD3DarkTheme,
  roundness: 3,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#B1C5FF',
    onPrimary: '#002C71',
    primaryContainer: '#00419E',
    onPrimaryContainer: '#DAE2FF',
    secondaryContainer: '#3C4356',
    onSecondaryContainer: '#DCE2F9',
    background: '#111318',
    surface: '#1B1D23',
    surfaceVariant: '#44474F',
    onSurfaceVariant: '#C5C6D0',
    outline: '#8F9099',
    outlineVariant: '#44474F',
    elevation: { ...MD3DarkTheme.colors.elevation, level1: '#1B1D23', level2: '#22252C' },
    success: '#7DDB8F',
    warning: '#F5BD5C',
    chartBar: '#B1C5FF',
    chartBarMuted: '#34405E',
  },
};

export function navigationTheme(theme: AppTheme): NavTheme {
  const base = theme.dark ? NavDarkTheme : NavLightTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.onSurface,
      border: theme.colors.outlineVariant,
    },
  };
}

export const useAppTheme = () => useTheme<AppTheme>();
