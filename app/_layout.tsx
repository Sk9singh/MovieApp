import { Stack, useRouter } from "expo-router";
import React, { useEffect } from 'react';
import './globals.css';
import { StatusBar } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    checkAuthAndRedirect();
  }, []);

  const checkAuthAndRedirect = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        
        console.log('No user token found, redirecting to login');
        router.replace("/login");
      } else {
        
        console.log('User token found, redirecting to main app');
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      router.replace("/login");
    }     
  };

  return (
    <>
      <StatusBar hidden={true} />
      <Stack>
        <Stack.Screen
          name="login"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="movies/[id]"
          options={{ headerShown: false }}
        />
      </Stack>   
    </> 
  );
}