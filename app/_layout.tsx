import { ThemeProvider } from 'expo-router/react-navigation';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';

import { darkTheme, lightTheme, navigationTheme } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const theme = useColorScheme() === 'dark' ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={theme}>
      <ThemeProvider value={navigationTheme(theme)}>
        <StatusBar style={theme.dark ? 'light' : 'dark'} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: theme.colors.background },
          }}
        />
      </ThemeProvider>
    </PaperProvider>
  );
}
