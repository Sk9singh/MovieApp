import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useWebSocket } from '@/hooks/webSockets';

const ChatRoom = () => {
  const router = useRouter();
  const { id: roomId } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { 
    isConnected, 
    messages, 
    joinRoom, 
    sendMessage, 
    clearMessages 
  } = useWebSocket();

  const [roomMessages, setRoomMessages] = useState<ChatMessage[]>([]);
  const [otherUser, setOtherUser] = useState<any>(null);
  const [roomData, setRoomData] = useState<any>(null);

  // Mock room data for now (replace with actual API call)
  useEffect(() => {
    if (roomId) {
      // TODO: Replace with actual API call
      const mockRoom = {
        _id: roomId,
        user1: { id: 'user1', username: 'TestUser1' },
        user2: { id: 'user2', username: 'TestUser2' },
        lastMessage: '',
        lastMessageTime: new Date(),
      };
      setRoomData(mockRoom);
      
      // Set other user safely
      if (user && mockRoom.user1 && mockRoom.user2) {
        const other = mockRoom.user1.id === user.id ? mockRoom.user2 : mockRoom.user1;
        setOtherUser(other);
      }
    }
  }, [roomId, user]);

  // Join room when component mounts
  useEffect(() => {
    if (roomId && isConnected) {
      joinRoom(roomId);
      clearMessages();
    }
  }, [roomId, isConnected]);

  // Update messages when new real-time messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      const currentRoomMessages = messages.filter( msg => msg.chatRoomId === roomId);
      setRoomMessages(prev => {
        const newMessages = currentRoomMessages.filter(
          newMsg => !prev.some(existingMsg => existingMsg._id === newMsg._id)
        );
        return [...prev, ...newMessages];
      });
    }
  }, [messages, roomId]);

  const handleSendMessage = (message: string) => {
    if (!roomId || !message.trim()) return;
    
    const success = sendMessage(roomId, message.trim());
    if (!success) {
      Alert.alert('Error', 'Failed to send message. Please check your connection.');
    }
  };

  const handleGoBack = () => {
    clearMessages();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/chats/chat');
    }
  };

  // Safety checks
  if (!user || !roomId) {
    return (
      <View className="flex-1 items-center justify-center bg-dark-200">
        <Text className="text-light-200">Invalid chat room</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-dark-200"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View className="flex-row items-center p-4 pt-12 bg-dark-300 border-b border-dark-100">
        <TouchableOpacity
          className="bg-accent rounded-xl w-10 h-10 items-center justify-center"
          onPress={handleGoBack}
        >
          <Text className="text-white text-lg">{"<"}</Text>
        </TouchableOpacity>
        
        <View className="flex-1 ml-4">
          <Text className="text-white text-lg font-semibold">
            {otherUser?.username || 'Chat Room'}
          </Text>
          <View className="flex-row items-center">
            <View className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <Text className="text-light-400 text-sm">
              {isConnected ? 'Connected' : 'Connecting...'}
            </Text>
          </View>
        </View>
      </View>

      {/* Messages List */}
      <View className="flex-1 px-4 py-4">
        {roomMessages.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-light-400 text-center">
              No messages yet. Start the conversation!
            </Text>
          </View>
        ) : (
          <FlatList
            data={roomMessages}
            renderItem={({ item }) => (
              <View className="mb-4">
                <View className={`max-w-[80%] p-3 rounded-lg ${
                  item.senderId === user.id 
                    ? 'bg-accent self-end' 
                    : 'bg-dark-100 self-start'
                }`}>
                  <Text className="text-white">{item.message}</Text>
                </View>
              </View>
            )}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Simple Message Input */}
      <View className="flex-row items-center p-4 bg-dark-300 border-t border-dark-100">
        <TextInput
          className="flex-1 bg-dark-100 text-white px-4 py-3 rounded-xl mr-3"
          placeholder="Type a message..."
          placeholderTextColor="#A8B5DB"
          onSubmitEditing={(e) => handleSendMessage(e.nativeEvent.text)}
          returnKeyType="send"
        />
        
        <TouchableOpacity
          className="bg-accent w-12 h-12 rounded-full items-center justify-center"
          onPress={() => {
            // For now, just a simple alert
            Alert.prompt('Send Message', 'Enter your message:', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Send', onPress: (value?: string) => handleSendMessage(value ?? '') }
            ]);
          }}
        >
          <Text className="text-white text-lg">→</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatRoom;