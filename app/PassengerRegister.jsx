import React, { useState } from 'react';
import {
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
  View as DefaultView,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../src/hooks/useAuth';
import { supabase } from '../src/api/supabase';

import { View, Text, Card } from '../src/components/Themed';
import { Button } from '../src/components/Button';
import { TextInput } from '../src/components/TextInput';
import { Spinner } from '../src/components/Spinner';
import { useTheme } from '../src/hooks/useTheme';

export default function PassengerRegisterScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme.colors);
  const { signUp } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    middleName: '',
    lastName: '',
    contactNo: '',
  });
  
  const [validId, setvalidId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.contactNo.trim()) newErrors.contactNo = 'Contact number is required';
    if (formData.contactNo.length < 10) newErrors.contactNo = 'Invalid contact number';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!validId) newErrors.validId = 'Valid ID photo is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: false, // Can only select one image
        allowsEditing: true, // Allows the user to crop / rotate their photo before uploading it
        quality: 1,
      });

      if (!result.canceled) {
        setvalidId(result.assets[0].uri);
        if (errors.validId) {
          setErrors(prev => ({ ...prev, validId: '' }));
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Please fill in all required fields correctly.');
      return;
    }

    setIsLoading(true);

    const { data, error } = await signUp({
      email: formData.email,
      password: formData.password,
      phone_no: formData.contactNo,
      first_name: formData.firstName,
      middle_name: formData.middleName,
      last_name: formData.lastName,
      user_type: 'passenger',
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else if (data.user) {
      if (validId) {
        const fileExt = validId.split('.').pop()?.toLowerCase() ?? 'jpeg';
        const fileName = `${data.user.id}.${fileExt}`;
        const file = {
          uri: validId,
          name: fileName,
          type: `image/${fileExt}`
        };

        const { error: uploadError } = await supabase.storage
          .from('valid-id')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: true // This allows overwriting existing files
          });

        if (uploadError) {
          console.error('ID upload failed:', uploadError);
          Alert.alert('Warning', 'Account created, but your valid ID upload failed. You can update it in your profile.');
        } else {
          try {
            const { data: publicUrlData } = supabase.storage
              .from('valid-id')
              .getPublicUrl(fileName);

            const valid_id_url = publicUrlData.publicUrl;

            const { error: updateError } = await supabase
              .from('profiles')
              .update({
                valid_id_url
              })
              .eq('id', data.user.id);

            if (updateError) {
              console.error('Profile update failed:', updateError);
              Alert.alert('Warning', 'ID uploaded successfully, but profile update failed.');
            } else {
              console.log('Valid ID uploaded and profile updated successfully');
            }
          } catch (error) {
            console.error('Error updating profile with valid_id_url:', error);
          }
        }
      }
      router.replace('/CheckEmail');
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Card style={styles.card}>
            <Text style={styles.title}>Create Your Account</Text>
            
            <TextInput
              placeholder="First Name *"
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
              placeholder="Last Name *"
              value={formData.lastName}
              onChangeText={(text) => updateFormData('lastName', text)}
              error={errors.lastName}
            />
            <TextInput
              placeholder="Contact Number *"
              value={formData.contactNo}
              onChangeText={(text) => updateFormData('contactNo', text)}
              keyboardType="phone-pad"
              error={errors.contactNo}
            />
            <TextInput
              placeholder="Email Address *"
              value={formData.email}
              onChangeText={(text) => updateFormData('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />
            <TextInput
              placeholder="Password (min. 6 characters) *"
              value={formData.password}
              onChangeText={(text) => updateFormData('password', text)}
              secureTextEntry
              error={errors.password}
            />
            <TextInput
              placeholder="Confirm Password *"
              value={formData.confirmPassword}
              onChangeText={(text) => updateFormData('confirmPassword', text)}
              secureTextEntry
              error={errors.confirmPassword}
            />

            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
              <Text style={{color: theme.colors.primary}}>
                {validId ? 'Change ID Photo' : 'Upload Valid ID *'}
              </Text>
            </TouchableOpacity>

            {validId && (
              <DefaultView style={styles.imagePreview}>
                <Image source={{ uri: validId }} style={styles.previewImage} />
              </DefaultView>
            )}
            {errors.validId && <Text style={styles.errorText}>{errors.validId}</Text>}

            <Button title="Create Account" onPress={handleRegister} disabled={isLoading} />
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
  errorText: {
    color: '#FF4444',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 16,
  },
});
