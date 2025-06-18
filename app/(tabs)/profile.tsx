import { View, Text, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = () => {
  const router = useRouter();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              // Remove stored tokens
              await AsyncStorage.removeItem('userToken');
              await AsyncStorage.removeItem('userData');
              
              console.log('User logged out successfully');
              
              // Navigate back to login screen
              router.replace('/login');
            } catch (error) {
              console.error('Error during logout:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-dark-300 justify-center items-center px-6">
      <View className="bg-light-300 p-8 rounded-xl shadow-lg w-full max-w-sm">
        <Text className="text-2xl font-bold text-center mb-8 text-gray-800">
          Profile
        </Text>
        
        <TouchableOpacity
          className="bg-gray-100 p-4 rounded-lg items-center"
          onPress={handleLogout}
        >
          <Text className="text-black text-lg font-bold">
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;