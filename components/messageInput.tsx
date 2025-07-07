import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Platform
} from 'react-native';
import { useWebSocket } from '@/hooks/webSockets';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  roomId: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled = false,
  roomId
}) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { sendTyping } = useWebSocket();
 const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  

  const handleSendMessage = () => {
    if (!message.trim() || disabled) return;
    
    onSendMessage(message.trim());
    setMessage('');
    
    // Stop typing indicator
    handleTypingStop();
  };

  const handleTextChange = (text: string) => {
    setMessage(text);
    
    // Handle typing indicator
    if (text.length > 0 && !isTyping) {
      setIsTyping(true);
      sendTyping(roomId, true);
    }
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      handleTypingStop();
    }, 2000);
  };

  const handleTypingStop = () => {
    if (isTyping) {
      setIsTyping(false);
      sendTyping(roomId, false);
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  return (
    <View className="flex-row items-end p-4 bg-dark-300 border-t border-dark-100">
      <View className="flex-1 mr-3">
        <TextInput
          className={`bg-dark-100 text-light-200 px-4 py-3 rounded-2xl border ${
            disabled ? 'border-gray-600' : 'border-dark-200'
          } text-base`}
          placeholder={disabled ? 'Connecting...' : 'Type a message...'}
          placeholderTextColor="#A8B5DB"
          value={message}
          onChangeText={handleTextChange}
          onBlur={handleTypingStop}
          multiline
          maxLength={1000}
          editable={!disabled}
          style={{
            maxHeight: 100,
            minHeight: Platform.OS === 'ios' ? 40 : 44
          }}
        />
      </View>
      
      <TouchableOpacity
        className={`w-12 h-12 rounded-full items-center justify-center ${
          message.trim() && !disabled
            ? 'bg-accent'
            : 'bg-gray-600'
        }`}
        onPress={handleSendMessage}
        disabled={!message.trim() || disabled}
      >
        <Text className="text-white text-lg font-bold">→</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MessageInput;