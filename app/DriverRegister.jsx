import React, { useState } from 'react';
import {
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/hooks/useAuth';

import { View, Text, Card } from '../src/components/Themed';
import { Button } from '../src/components/Button';
import { TextInput } from '../src/components/TextInput';
import { Spinner } from '../src/components/Spinner';
import { useTheme } from '../src/hooks/useTheme';

export default function DriverRegisterScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { colors } = theme;
  const { signUp } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    middleName: '',
    lastName: '',
    phoneNumber: '',
    licenseNumber: '',
    vehicleType: '',
    plateNumber: '',
    vehicleModel: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (formData.phoneNumber.length < 10) newErrors.phoneNumber = 'Invalid phone number';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.licenseNumber.trim()) newErrors.licenseNumber = 'License number is required';
    if (!formData.vehicleType) newErrors.vehicleType = 'Vehicle type is required';
    if (!formData.plateNumber.trim()) newErrors.plateNumber = 'Plate number is required';
    if (!formData.vehicleModel.trim()) newErrors.vehicleModel = 'Vehicle model is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Please fill in all required fields correctly.');
      return;
    }

    setIsLoading(true);

    const { error } = await signUp({
      email: formData.email,
      password: formData.password,
      first_name: formData.firstName,
      middle_name: formData.middleName,
      last_name: formData.lastName,
      contact_no: formData.phoneNumber,
      user_type: 'driver',
      license_number: formData.licenseNumber,
      vehicle_type: formData.vehicleType,
      plate_number: formData.plateNumber,
      vehicle_model: formData.vehicleModel,
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert(
        'Registration Successful! 🎉',
        'Please check your email for verification.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }
    setIsLoading(false);
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Card style={styles.card}>
            <Text style={styles.title}>Become a Driver</Text>
            
            <TextInput
              placeholder="First Name"
              value={formData.firstName}
              onChangeText={(text) => updateFormData('firstName', text)}
              error={errors.firstName}
            />
            <TextInput
              placeholder="Middle Name"
              value={formData.middleName}
              onChangeText={(text) => updateFormData('middleName', text)}
              error={errors.middleName}
            />
            <TextInput
              placeholder="Last Name"
              value={formData.lastName}
              onChangeText={(text) => updateFormData('lastName', text)}
              error={errors.lastName}
            />
            <TextInput
              placeholder="Email Address"
              value={formData.email}
              onChangeText={(text) => updateFormData('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />
            <TextInput
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChangeText={(text) => updateFormData('phoneNumber', text)}
              keyboardType="phone-pad"
              error={errors.phoneNumber}
            />
            <TextInput
              placeholder="Driver's License Number"
              value={formData.licenseNumber}
              onChangeText={(text) => updateFormData('licenseNumber', text)}
              error={errors.licenseNumber}
            />
            <TextInput
              placeholder="Vehicle Model/Brand"
              value={formData.vehicleModel}
              onChangeText={(text) => updateFormData('vehicleModel', text)}
              error={errors.vehicleModel}
            />
            <TextInput
              placeholder="Plate Number"
              value={formData.plateNumber}
              onChangeText={(text) => updateFormData('plateNumber', text.toUpperCase())}
              autoCapitalize="characters"
              error={errors.plateNumber}
            />
            <TextInput
              placeholder="Password (min. 6 characters)"
              value={formData.password}
              onChangeText={(text) => updateFormData('password', text)}
              secureTextEntry
              error={errors.password}
            />
            <TextInput
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={(text) => updateFormData('confirmPassword', text)}
              secureTextEntry
              error={errors.confirmPassword}
            />

            <Text style={styles.fieldLabel}>Vehicle Type</Text>
            <View style={styles.vehicleTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.vehicleButton,
                  { borderColor: colors.border },
                  formData.vehicleType === 'tricycle' && { backgroundColor: colors.primary, borderColor: colors.primary }
                ]}
                onPress={() => updateFormData('vehicleType', 'tricycle')}
              >
                <Text style={formData.vehicleType === 'tricycle' && { color: colors.buttonText }}>Tricycle</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.vehicleButton,
                  { borderColor: colors.border },
                  formData.vehicleType === 'tuktuk' && { backgroundColor: colors.primary, borderColor: colors.primary }
                ]}
                onPress={() => updateFormData('vehicleType', 'tuktuk')}
              >
                <Text style={formData.vehicleType === 'tuktuk' && { color: colors.buttonText }}>TukTuk</Text>
              </TouchableOpacity>
            </View>
            {errors.vehicleType && <Text style={styles.errorText}>{errors.vehicleType}</Text>}

            <Button title="Register" onPress={handleRegister} disabled={isLoading} />
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
  card: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  vehicleTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  vehicleButton: {
    flex: 0.48,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  errorText: {
    color: '#FF4444',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 16,
  },
});
