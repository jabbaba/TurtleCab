import React, { useState } from 'react';
import {
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useDriverAuth } from '../src/hooks/useDriverAuth';

import { View, Text, Card } from '../src/components/Themed';
import { Button } from '../src/components/Button';
import { TextInput } from '../src/components/TextInput';
import { Spinner } from '../src/components/Spinner';
import { useTheme } from '../src/hooks/useTheme';

export default function DriverRegisterScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = getStyles(colors);
  const { signUp } = useDriverAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    middleName: '',
    lastName: '',
    phoneNumber: '',
    licenseNumber: '',
    plateNumber: '',
    vehicleModel: '',
  });

  const [vehicleImage, setVehicleImage] = useState(null);
  const [certificateOfRegistration, setCertificateOfRegistration] = useState(null);
  const [driversLicense, setDriversLicense] = useState(null);
  
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
    if (!formData.plateNumber.trim()) newErrors.plateNumber = 'Plate number is required';
    if (!formData.vehicleModel.trim()) newErrors.vehicleModel = 'Vehicle model is required';
    if (!vehicleImage) newErrors.vehicleImage = 'Vehicle image is required';
    if (!certificateOfRegistration) newErrors.certificateOfRegistration = 'Certificate of Registration is required';
    if (!driversLicense) newErrors.driversLicense = 'Driver\'s license is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Please fill in all required fields correctly.');
      return;
    }

    setIsLoading(true);

    try {
      const uploadImage = async (uri, bucket) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}`;
        const { data, error } = await supabase.storage.from(bucket).upload(fileName, blob);
        if (error) {
          throw error;
        }
        return data.path;
      };

      const vehicleImageUrl = await uploadImage(vehicleImage, 'vehicles');
      const certificateOfRegistrationUrl = await uploadImage(certificateOfRegistration, 'certificate-of-registration');
      const driversLicenseUrl = await uploadImage(driversLicense, 'driver-id');

      const { error } = await signUp({
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        middle_name: formData.middleName,
        last_name: formData.lastName,
        contact_no: formData.phoneNumber,
        user_type: 'driver',
        license_number: formData.licenseNumber,
        plate_number: formData.plateNumber,
        vehicle_model: formData.vehicleModel,
        vehicle_image_url: vehicleImageUrl,
        certificate_of_registration_url: certificateOfRegistrationUrl,
        drivers_license_url: driversLicenseUrl,
      });

      if (error) {
        throw error;
      }

      Alert.alert(
        'Registration Successful! 🎉',
        'Please check your email for verification.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const pickImage = async (type) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: false, // Can only select one image
      allowsEditing: true, // Allows the user to crop / rotate their photo before uploading it
      quality: 1,
    });

    if (!result.canceled) {
      if (type === 'vehicle') {
        setVehicleImage(result.assets[0].uri);
      } else if (type === 'registration') {
        setCertificateOfRegistration(result.assets[0].uri);
      } else if (type === 'license') {
        setDriversLicense(result.assets[0].uri);
      }
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

            <Text style={styles.fieldLabel}>Vehicle Image</Text>
            <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage('vehicle')}>
              <Text style={{color: colors.primary}}>
                {vehicleImage ? 'Change Vehicle Image' : 'Upload Vehicle Image *'}
              </Text>
            </TouchableOpacity>
            {vehicleImage && (
              <View style={styles.imagePreview}>
                <Image source={{ uri: vehicleImage }} style={styles.previewImage} />
              </View>
            )}
            {errors.vehicleImage && <Text style={styles.errorText}>{errors.vehicleImage}</Text>}

            <Text style={styles.fieldLabel}>Certificate of Registration</Text>
            <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage('registration')}>
              <Text style={{color: colors.primary}}>
                {certificateOfRegistration ? 'Change Certificate' : 'Upload Certificate of Registration *'}
              </Text>
            </TouchableOpacity>
            {certificateOfRegistration && (
              <View style={styles.imagePreview}>
                <Image source={{ uri: certificateOfRegistration }} style={styles.previewImage} />
              </View>
            )}
            {errors.certificateOfRegistration && <Text style={styles.errorText}>{errors.certificateOfRegistration}</Text>}

            <Text style={styles.fieldLabel}>Driver's License</Text>
            <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage('license')}>
              <Text style={{color: colors.primary}}>
                {driversLicense ? "Change Driver's License" : "Upload Driver's License *"}
              </Text>
            </TouchableOpacity>
            {driversLicense && (
              <View style={styles.imagePreview}>
                <Image source={{ uri: driversLicense }} style={styles.previewImage} />
              </View>
            )}
            {errors.driversLicense && <Text style={styles.errorText}>{errors.driversLicense}</Text>}

            <Button title="Register" onPress={handleRegister} disabled={isLoading} style={{ marginTop: 20 }} />
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const getStyles = (colors) => StyleSheet.create({
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
    marginTop: 20,
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
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginVertical: 10,
  },
  uploadButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  imagePreview: {
    alignItems: 'center',
    marginVertical: 10,
  },
  previewImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
});
