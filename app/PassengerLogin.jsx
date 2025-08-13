import React, { useState } from 'react';
import {
  StyleSheet,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/hooks/useAuth';

import { View, Text, Card } from '../src/components/Themed';
import { Button } from '../src/components/Button';
import { TextInput } from '../src/components/TextInput';
import { Spinner } from '../src/components/Spinner';
import { Logo } from '../src/components/Logo';
import { useTheme } from '../src/hooks/useTheme';

export default function PassengerLoginScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    const { data, error } = await signIn({ email, password });

    if (error) {
      Alert.alert('Error', error.message);
    } else if (data.profile) {
      if (data.profile.user_type = 'passenger') {
        router.replace('/PassengerProfile');
      } else if (data.profile.user_type = 'driver') {
        Alert.alert('Error', 'You are logged in as a driver. Please use the driver login.');
      } 
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Logo style={styles.logo} />
          <Card style={styles.card}>
            <Text style={styles.title}>Welcome Back!</Text>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <Button title="Login" onPress={handleLogin} />
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  logo: {
    alignSelf: 'center',
    marginBottom: 24,
  },
  card: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
});
