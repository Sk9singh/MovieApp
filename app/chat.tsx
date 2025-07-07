import React, {useState} from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { images } from '@/constants/images';
import { useAuth } from '@/hooks/useAuth';
import { useWebSocket } from '@/hooks/webSockets';
import { chatApi } from '@/services/chatApi';
import useFetch from '@/services/useFetch';
import SearchModal from '@/components/searchUser';

const Chat = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { isConnected, connectionError,  toggleConnection } = useWebSocket();
  const [showSearchModal, setShowSearchModal] = useState(false);
  
  // Fetch chat rooms 
  const { 
    data: chatRooms, 
    loading, 
    error, 
    refetch 
  } = useFetch<ChatRoom[]>(() => chatApi.getChatRooms());

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-dark-200">
        <Text className="text-light-200 text-xl">No user data found</Text>
      </View>
    );
  }

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/profile');
    }
  };

  const navigateToChatRoom = (roomId: string) => {
    router.push(`/chats/${roomId}`);
  };

  const handleUserSelect = async (selectedUser: SearchUserData) => {
    try {
      console.log('Selected user:', selectedUser);
      
      const newRoom = await chatApi.createChatRoom({
        otherUserId: selectedUser._id,
        otherUsername: `${selectedUser.firstName} ${selectedUser.lastName}`
      });
      
      
      navigateToChatRoom(newRoom._id);
      refetch();
    } catch (error) {
      console.error('Failed to create chat room:', error);
      Alert.alert('Error', 'Failed to create chat room. Please try again.');
    }
  };

  const createNewChat = () => {
    setShowSearchModal(true);
  };

  const renderChatRoom = ({ item: room }: { item: ChatRoom }) => {
    if (!room?.user1 || !room?.user2) return null;
    const otherUser = room.user1.id === user.id ? room.user2 : room.user1;
    const lastMessageTime = new Date(room.lastMessageTime).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    return (
      <TouchableOpacity
        className="bg-accent p-4 mx-8 mb-4 mt-4 rounded-3xl border border-b-[3px] border-b-light-200"
        onPress={() => navigateToChatRoom(room._id)}
      >
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Text className="text-light-200 text-lg font-semibold">
              {otherUser.username}
            </Text>
            <Text className={`text-sm mt-1 ${room.lastMessage ? "text-purple-900": "text-dark-200"}`} numberOfLines={1}>
              {room.lastMessage || 'No messages yet'}
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-light-400 text-xs">{lastMessageTime}</Text>
            {/* You can add unread message count here */}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-dark-200">
      <Image source={images.bg} className="absolute w-full h-full z-0" resizeMode="cover" />
      
      {/* Header */}
      <View className="flex-row items-center p-4 pt-12">
        <TouchableOpacity
          className="bg-accent rounded-xl w-12 h-12 items-center justify-center border"
          onPress={handleGoBack}
        >
          <Text className="text-white text-2xl">{"<"}</Text>
        </TouchableOpacity>
        
        <Text className="flex-1 text-white text-2xl font-bold ml-6">
          Chat Rooms
        </Text>
        
        <TouchableOpacity
          className="bg-accent rounded-xl w-12 h-12 items-center justify-center border"
          onPress={createNewChat}
        >
          <Text className="text-white text-2xl">+</Text>
        </TouchableOpacity>
      </View>

      {/* Connection Status */}
      <View className="mx-4 mb-2">
        <TouchableOpacity className={`p-1 rounded-lg ${isConnected ? 'bg-green-600' : 'bg-red-500'} active:opacity-20`} onPress={toggleConnection}>
          <Text className="text-white/80 text-center text-sm">
            {isConnected ? '🟢 Connection is Ready' : '🔴 No Connection'}
          </Text>
        </TouchableOpacity>
        {connectionError && (
          <Text className="text-red-400 text-center text-sm mt-1">
            Error: {connectionError}
          </Text>
        )}
      </View>

      {/* Chat Rooms List */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#B19CD9" />
          <Text className="text-light-200 mt-2">Loading chat rooms...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-red-400 text-center mb-4">
            Failed to load chat rooms
          </Text>
          <TouchableOpacity
            className="bg-accent px-4 py-2 rounded-lg"
            onPress={refetch}
          >
            <Text className="text-white">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : !chatRooms || chatRooms.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-light-300 text-center mb-4 text-lg">
            No chat rooms yet
          </Text>
          <Text className="text-light-400 text-center mb-6 px-8">
            Start a new conversation by tapping the + button above
          </Text>
          <TouchableOpacity
            className="bg-accent px-6 py-3 rounded-xl"
            onPress={createNewChat}
          >
            <Text className="text-white font-semibold">Start Your First Chat</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={chatRooms}
          renderItem={renderChatRoom}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
      <SearchModal
        visible={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onUserSelect={handleUserSelect}
      />
    </View>
  );
};

export default Chat;