import { Stack } from 'expo-router';
import { ThemeProvider } from '../src/context/ThemeContext';
import { AuthProvider } from '../src/context/AuthContext';
import { DriverAuthProvider } from '../src/context/DriverAuthContext';
import { useTheme } from '../src/hooks/useTheme';

function StackLayout() {
  const { theme } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.buttonText,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="PassengerLogin" options={{ title: 'Passenger Login' }} />
      <Stack.Screen name="PassengerRegister" options={{ title: 'Passenger Registration' }} />
      <Stack.Screen name="DriverLogin" options={{ title: 'Driver Login' }} />
      <Stack.Screen name="DriverRegister" options={{ title: 'Driver Registration' }} />
      <Stack.Screen name="Verification" options={{ title: 'Verification' }} />
      <Stack.Screen name="CheckEmail" options={{ title: 'Check Your Email' }} />
      <Stack.Screen name="PassengerProfile" options={{ title: 'Passenger Profile' }} />
      <Stack.Screen name="DriverProfile" options={{ title: 'Driver Profile' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DriverAuthProvider>
          <StackLayout />
        </DriverAuthProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
