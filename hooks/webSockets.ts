import { useState, useEffect, useRef, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './useAuth';

const WS_URL = process.env.EXPO_PUBLIC_BACKEND_URL?.replace('http', 'ws') + '/chat';

export const useWebSocket = () => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [manualControl, setManualControl] = useState(false);
  
  const socketRef = useRef<typeof Socket | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Connect to WebSocket
  const connect = useCallback(async () => {
    if (!user || socketRef.current?.connected) return;

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        setConnectionError('No authentication token found');
        return;
      }

      const fullName = `${user.firstName} ${user.lastName}`;
      
      socketRef.current = io(WS_URL, {
        auth: { token },
        query: { 
          userId: user.id, 
          fullName: fullName, 
          email: user.email 
        }
      });

      const socket = socketRef.current;

      socket.on('connect', () => {
        setIsConnected(true);
        setConnectionError(null);
      });

      socket.on('disconnect', () => {
        setIsConnected(false);
      });

      socket.on('connect_error', (error: any) => {
        setConnectionError(error.message);
        setIsConnected(false);
      });

      socket.on('newMessage', (message: ChatMessage) => {
        setMessages(prev => [...prev, message]);
      });

      // Typing events
      socket.on('userTyping', (data: any) => {
        if (data.isTyping) {
          setTypingUsers(prev => new Set([...prev, data.userId]));
          
          // Clear typing after 3 seconds
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
          }
          typingTimeoutRef.current = setTimeout(() => {
            setTypingUsers(prev => {
              const newSet = new Set(prev);
              newSet.delete(data.userId);
              return newSet;
            });
          }, 3000);
        } else {
          setTypingUsers(prev => {
            const newSet = new Set(prev);
            newSet.delete(data.userId);
            return newSet;
          });
        }
      });

    } catch (error: any) {
      setConnectionError('Failed to connect to chat server');
    }
  }, [user]);

  // Disconnect
  const disconnect = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    socketRef.current?.disconnect();
    setIsConnected(false);
    setMessages([]);
    setConnectionError(null);
    setTypingUsers(new Set());
  }, []);

  const toggleConnection = useCallback(() => {
    setManualControl(true);
    if (isConnected) {
      disconnect();
    } else {
      connect();
    }
  }, [isConnected, connect, disconnect]);

  // Join room
  const joinRoom = useCallback((roomId: string) => {
    socketRef.current?.emit('joinRoom', { roomId });
  }, []);

  // Send message
  const sendMessage = useCallback((roomId: string, message: string) => {
    if (!socketRef.current?.connected) return false;
    
    socketRef.current.emit('sendMessage', {
      chatRoomId: roomId,
      message: message.trim()
    });
    return true;
  }, []);

  // Send typing indicator
  const sendTyping = useCallback((roomId: string, isTyping: boolean) => {
    if (!socketRef.current?.connected) return;
    
    socketRef.current.emit('typing', { roomId, isTyping });
  }, []);

  // Clear messages
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // Auto-connect when user available
  // useEffect(() => {
  //   if (user) connect();
  //   return () => disconnect();
  // }, [user, connect, disconnect]);
  useEffect(() => {
    if (user && !manualControl) {
      connect();
    }
    return () => disconnect();
  }, [user, connect, disconnect, manualControl]);

  return {
    isConnected,
    connectionError,
    messages,
    typingUsers,        
    joinRoom,
    sendMessage,
    sendTyping,         
    clearMessages,
    toggleConnection
  };
};