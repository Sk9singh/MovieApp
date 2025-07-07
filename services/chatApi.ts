import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('userToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const chatApi = {
  // Get user's chat rooms
  async getChatRooms(): Promise<ChatRoom[]> {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(`${API_BACKEND_URL}/chat/rooms`, { headers });
      return response.data;
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
      throw error;
    }
  },

  // Create or get existing chat room
  async createChatRoom(data: CreateChatRoomData): Promise<ChatRoom> {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.post(`${API_BACKEND_URL}/chat/rooms`, data, { headers });
      return response.data;
    } catch (error) {
      console.error('Error creating chat room:', error);
      throw error;
    }
  },

  // Get chat messages for a room
  async getChatMessages(roomId: string): Promise<ChatMessage[]> {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(`${API_BACKEND_URL}/chat/rooms/${roomId}/messages`, { headers });
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  // Send message via REST (fallback if WebSocket fails)
  async sendMessage(data: SendMessageData): Promise<ChatMessage> {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.post(`${API_BACKEND_URL}/chat/messages`, data, { headers });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  async getRoomDetailsById(roomId: string): Promise<{ room: ChatRoom; messages: ChatMessage[] }> {
    try {
      const headers = await getAuthHeaders();
      const response = await axios.get(`${API_BACKEND_URL}/chat/rooms/${roomId}`, { headers });
      return response.data;
    } catch (error) {
      console.error('Error fetching room details:', error);
      throw error;
    }
  },

async getUserByDetails(searchTerm: string): Promise<SearchUserData[]> {
  try {
    const headers = await getAuthHeaders();
    const params = {
      firstName: searchTerm,
      email: searchTerm
    };
    const response = await axios.get(`${API_BACKEND_URL}/auth/profile`, {
      headers,
      params
    });
    return response.data;
  } catch (error) {
    console.error('Search API failed:', error);
    throw error;
   }
 }
};
