import { View, Text, TouchableOpacity, Alert, Image } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { icons } from '@/constants/icons';
import { useAuth } from '@/hooks/useAuth';

const Profile = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  if (loading) {
    return <View className="flex-1 items-center justify-center"><Text className="text-light-200">Loading...</Text></View>;
  }
  if (!user) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-light-200">No user data found</Text>
      </View>
    );
  }
  const userName = `${user.firstName} ${user.lastName}`;
  const userEmail = user.email;
  


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
    <View className="flex-1 bg-dark-300">
      <View>
        <Text className="text-2xl font-bold left-4 mt-5 text-light-200">
          Account Details
        </Text>
        <View>
          <Text className="text-lg font-semibold text-light-300 mt-3 ml-4">Account Owner : { userName }</Text>
          <Text className="text-lg font-semibold text-light-300 mt-3 ml-4">Email : { userEmail }</Text>
        </View>
      </View>
      <View className="justify-center mt-8 left-4"> 
        <Text className="text-2xl font-bold text-light-200 mb-4">Further Details .....</Text>
      
      </View>
      <View className='absolute right-4 top-6 z-10'>
       <TouchableOpacity className="bg-accent w-16 h-16 rounded-full items-center justify-center shadow-lg" onPress={handleLogout} >
        <Image source={icons.person} tintColor="#151312" className="size-8" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;