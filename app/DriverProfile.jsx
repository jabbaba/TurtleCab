import React from 'react';
import { StyleSheet, Alert, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/hooks/useAuth';

import { View, Text, Card } from '../src/components/Themed';
import { Button } from '../src/components/Button';
import { Spinner } from '../src/components/Spinner';
import { Logo } from '../src/components/Logo';

export default function DriverProfileScreen() {
  const router = useRouter();
  const { user, profile, loading, signOut } = useAuth();

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      router.replace('/');
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Logo style={styles.logo} />
        <Card style={styles.card}>
          {user && profile ? (
            <>
              <Text style={styles.title}>Driver Profile</Text>
              <Text style={styles.name}>{profile.first_name}</Text>
              <Text style={styles.email}>{user.email}</Text>
              <Button title="Logout" onPress={handleLogout} />
            </>
          ) : (
            <Text>You are not logged in.</Text>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  email: {
    fontSize: 18,
    marginBottom: 20,
  },
});
