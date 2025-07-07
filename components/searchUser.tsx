import React, { useState, useEffect, useRef } from 'react';
import {Modal, View, Text, TextInput, TouchableOpacity,FlatList,ActivityIndicator } from 'react-native';
import { chatApi } from '@/services/chatApi';

interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
  onUserSelect: (user: SearchUserData) => void;
}

const SearchModal  = ({visible, onClose, onUserSelect }: SearchModalProps ) => {
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState<SearchUserData[]>([]);
  const [loading, setLoading] = useState(false);
  
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

   
    if (!searchText.trim() || searchText.trim().length < 2) {
      setUsers([]);
      setLoading(false);
      return;
    }

   
    setLoading(true);


    searchTimeoutRef.current = setTimeout(() => {
      searchUsers(searchText.trim());
    }, 500); // Debounce search by 500ms

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchText]);

  const searchUsers = async (query: string) => {
    try {
      const results = await chatApi.getUserByDetails(query);
      setUsers(results || []);
    } catch (error) {
      console.error('Search failed:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (user: SearchUserData) => {
    onUserSelect(user);      
    handleClose();
  };

  const handleClose = () => {
    setSearchText('');
    setUsers([]);
    setLoading(false);
    onClose();
  };

  const renderUser = ({ item }: { item: SearchUserData }) => (
    <TouchableOpacity
      className="bg-dark-200 p-4 mb-2 rounded-lg border border-dark-300"
      onPress={() => handleUserSelect(item)}
    >
      <View className="flex-row items-center">
        {/* User Avatar */}
        <View className="w-12 h-12 bg-accent rounded-full items-center justify-center mr-3">
          <Text className="text-white font-bold text-lg">
            {item.firstName.charAt(0).toUpperCase()}
          </Text>
        </View>
        
        {/* User Details */}
        <View className="flex-1">
          <Text className="text-white text-base font-semibold">
            {item.firstName} {item.lastName}
          </Text>
          <Text className="text-light-300 text-sm mt-0.5">
            {item.email}
          </Text>
        </View>
        
        {/* Select Icon */}
        <Text className="text-accent text-xl">→</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-dark-300 rounded-xl mx-4 w-full max-w-md">
          <View className="p-4 border-b border-dark-200">
            <Text className="text-white text-xl font-bold text-center">
              Find People
            </Text>
          </View>

          <View className="p-4">
            <TextInput
              className="bg-dark-100 text-white p-3 rounded-lg text-base"
              placeholder="Type name or email..."
              placeholderTextColor="#A8B5DB"
              value={searchText}
              onChangeText={setSearchText}
              autoFocus
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View className="px-4 pb-4 max-h-80">
            {loading ? (
              <View className="items-center py-8">
                <ActivityIndicator size="large" color="#B19CD9" />
                <Text className="text-light-300 mt-2">Searching...</Text>
              </View>
            ) : users.length > 0 ? (
              <FlatList
                data={users}
                renderItem={renderUser}
                keyExtractor={(item) => item._id}
                showsVerticalScrollIndicator={false}
              />
            ) : searchText.length >= 2 ? (
              <View className="items-center py-8">
                <Text className="text-[#A8B5DB] text-center">
                  No users found for {searchText}
                </Text>
              </View>
            ) : (
              <View className="items-center py-8">
                <Text className="text-[#A8B5DB] text-center">
                    Search Results
                </Text>
              </View>
            )}
          </View>

          {/* Cancel Button */}
          <View className="p-4 ">
            <TouchableOpacity
              className="bg-gray-300 p-4 rounded-lg w-80 mx-auto border-accent border-b-[3px]"
              onPress={handleClose}
            >
              <Text className="text-black/90 text-center font-semibold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SearchModal;