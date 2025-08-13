import React, { useState, useEffect } from 'react';
import { StyleSheet, Animated, SafeAreaView, View as DefaultView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { View, Text } from '../src/components/Themed';
import { Button } from '../src/components/Button';
import { Logo } from '../src/components/Logo';
import { useTheme } from '../src/hooks/useTheme';

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.primary }]}>
      <LinearGradient
        colors={[theme.colors.primary, '#F7931E', '#FFD23F']}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <DefaultView style={styles.decorativeContainer}>
          <DefaultView style={styles.circle1} />
          <DefaultView style={styles.circle2} />
          <DefaultView style={styles.circle3} />
        </DefaultView>

        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Logo style={styles.logo} />
          <Text style={styles.tagline}>Your Local Adventure Awaits</Text>

          <DefaultView style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Welcome to</Text>
            <Text style={styles.welcomeSubtitle}>The Future of Local Transport</Text>
            <Text style={styles.description}>
              Safe, affordable, and eco-friendly rides with tricycles and tuktuks
            </Text>
          </DefaultView>

          <DefaultView style={styles.buttonContainer}>
            <DefaultView style={styles.buttonRow}>
              <Button
                title="I Need a Ride"
                onPress={() => router.push('/PassengerLogin')}
                style={{ flex: 1, marginRight: 8, backgroundColor: theme.colors.card }}
                textStyle={{ color: theme.colors.primary }}
              />
              <Button
                title="New Passenger"
                onPress={() => router.push('/PassengerRegister')}
                style={{ flex: 1,  marginLeft: 8, backgroundColor: theme.colors.card }}
                textStyle={{ color: theme.colors.primary }}
              />
            </DefaultView>
            
            <DefaultView style={styles.divider}>
              <DefaultView style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <DefaultView style={styles.dividerLine} />
            </DefaultView>

            <DefaultView style={styles.buttonRow}>
               <Button
                title="I'm a Driver"
                onPress={() => router.push('/DriverLogin')}
                style={{ flex: 1, marginRight: 8, backgroundColor: theme.colors.success }}
              />
              <Button
                title="Drive with Us"
                onPress={() => router.push('/DriverRegister')}
                style={{ flex: 1, marginLeft: 8, backgroundColor: theme.colors.success }}
              />
            </DefaultView>
          </DefaultView>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  decorativeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  circle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -50,
    right: -50,
  },
  circle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    bottom: 100,
    left: -30,
  },
  circle3: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    top: '50%',
    right: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  tagline: {
    fontSize: 16,
    opacity: 0.9,
    fontStyle: 'italic',
    color: '#FFFFFF',
  },
  welcomeSection: {
    alignItems: 'center',
    marginVertical: 40,
    backgroundColor: 'transparent',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '300',
    opacity: 0.9,
    color: '#FFFFFF',
  },
  welcomeSubtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#FFFFFF',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 22,
    paddingHorizontal: 20,
    color: '#FFFFFF',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 30,
    backgroundColor: 'transparent',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    backgroundColor: 'transparent',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dividerText: {
    fontWeight: 'bold',
    marginHorizontal: 15,
    fontSize: 14,
    color: '#FFFFFF',
  },
});
