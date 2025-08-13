import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

import { View, Text, Card } from '../src/components/Themed';
import { Button } from '../src/components/Button';
import { Logo } from '../src/components/Logo';

export default function CheckEmailScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Logo style={styles.logo} />
        <Card style={styles.card}>
          <Text style={styles.title}>Check Your Email</Text>
          <Text style={styles.message}>
            We've sent a verification link to your email address. Please click the link to complete your registration.
          </Text>
          <Button
            title="Go to Login"
            onPress={() => router.replace('/PassengerLogin')}
            style={{ marginTop: 16 }}
          />
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
