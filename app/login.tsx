import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL; 

interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  token: string;
};

const LoginScreen = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
 
  const clearForm = () => {
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    
    try {
        const response = await axios.post<AuthResponse>(`${API_URL}/auth/signin`, {
          email: email.toLowerCase().trim(),
          password,
      });

        const { data } = response; 
          
          await AsyncStorage.setItem('userToken', data.token);
          await AsyncStorage.setItem('userData', JSON.stringify(data.user));
          
          Alert.alert('Success', 'Login successful');
          console.log('Logged in user :', data.user);
          router.replace('/(tabs)');

    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Invalid credentials';
      Alert.alert('Login Failed', errorMessage);
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if( !email || !password || !firstName || !lastName) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
        const response = await axios.post<AuthResponse>(`${API_URL}/auth/signup`, {
        email: email.toLowerCase().trim(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

    const { data } = response;
    await AsyncStorage.setItem('userToken', data.token);
    await AsyncStorage.setItem('userData', JSON.stringify(data.user));
    Alert.alert('Success', 'Sign up successful');
    console.log('Signed up user :', data.user);
    router.replace('/(tabs)');
   } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Sign up failed';
      Alert.alert('Sign Up Failed', errorMessage);
      console.error('Sign up error:', error);
    }
    finally {
      setLoading(false);
    }
};
  
 return (
    <KeyboardAvoidingView 
      className="flex-1 bg-dark-200" 
    >
      <View className="flex-1 justify-center px-6 ">
        <View className="bg-light-300 p-6 rounded-xl">
          {/* Header */}
          <Text className="text-2xl font-bold text-center mb-1 text-accent">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </Text>
          <Text className="text-sm text-center mb-6 text-gray-600">
            {isLogin ? 'Sign in to continue' : 'Sign up to get started'}
          </Text>

          {/* Sign Up Fields */}
          {!isLogin && (
            <View className="mb-4">
              <TextInput
                className="border border-gray-300 p-3 rounded-lg mb-3 text-base bg-gray-50"
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
              />
              <TextInput
                className="border border-gray-300 p-3 rounded-lg text-base bg-gray-50"
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
                
              />
            </View>
          )}

          {/* Common Fields */}
          <View className="mb-4">
            <TextInput
              className="border border-gray-300 p-3 rounded-lg mb-3 text-base bg-gray-50"
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            
            <TextInput
              className="border border-gray-300 p-3 rounded-lg text-base bg-gray-50"
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Action Button */}
          <TouchableOpacity
            className={`p-3 rounded-lg items-center mb-4 ${
              loading ? 'bg-gray-400' : 'bg-blue-500'
            }`}
            onPress={isLogin ? handleLogin : handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-base font-bold">
                {isLogin ? 'Sign In' : 'Sign Up'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Toggle Between Login/SignUp */}
          <View className="flex-row justify-center items-center">
            <Text className="text-sm text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setIsLogin(!isLogin);
                clearForm();
              }}
            >
              <Text className="text-sm text-blue-500 font-bold">
                {isLogin ? 'Sign Up' : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;