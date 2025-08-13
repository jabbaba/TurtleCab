import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert, SafeAreaView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '../src/api/supabase';

import { View, Text, Card } from '../src/components/Themed';
import { Button } from '../src/components/Button';
import { Spinner } from '../src/components/Spinner';
import { Logo } from '../src/components/Logo';

export default function VerificationScreen() {
  const router = useRouter();
  const { token, email } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('Verifying your account...');

  useEffect(() => {
    if (token && email) {
      verifyToken();
    } else {
      setIsLoading(false);
      setMessage('Invalid verification link.');
    }
  }, [token, email]);

  const verifyToken = async () => {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Your account has been successfully verified!');
      setTimeout(() => router.replace('/Profile'), 3000);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Logo style={styles.logo} />
        <Card style={styles.card}>
          <Text style={styles.title}>Account Verification</Text>
          <Text style={styles.message}>{message}</Text>
          {!isLoading && (
            <Button
              title="Go to Profile"
              onPress={() => router.replace('/Profile')}
              style={{ marginTop: 16 }}
            />
          )}
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
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
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
});
