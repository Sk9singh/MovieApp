import React from 'react';
import { View, Text } from 'react-native';

interface MessageBubbleProps {
  message: ChatMessage;
  isMyMessage: boolean;
  showTimestamp: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isMyMessage, 
  showTimestamp 
}) => {
  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <View className="mb-4">
      {/* Timestamp */}
      {showTimestamp && (
        <Text className="text-light-400 text-xs text-center mb-2">
          {formatTime(message.timestamp)}
        </Text>
      )}
      
      {/* Message Bubble */}
      <View className={`flex-row ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
        <View
          className={`max-w-[80%] px-4 py-3 rounded-2xl ${
            isMyMessage
              ? 'bg-accent rounded-br-md'
              : 'bg-dark-100 rounded-bl-md border border-dark-300'
          }`}
        >
          {/* Sender Name (for other user's messages) */}
          {!isMyMessage && (
            <Text className="text-light-400 text-xs mb-1 font-semibold">
              {message.senderName}
            </Text>
          )}
          
          {/* Message Text */}
          <Text
            className={`text-base ${
              isMyMessage ? 'text-white' : 'text-light-200'
            }`}
          >
            {message.message}
          </Text>
          
          {/* Movie Share (if applicable) */}
          {message.isMovieShare && message.movieId && (
            <View className="mt-2 p-2 bg-dark-200 rounded-lg">
              <Text className="text-light-300 text-sm">
                🎬 Shared a movie
              </Text>
            </View>
          )}
          
          {/* Message Time */}
          <Text
            className={`text-xs mt-1 ${
              isMyMessage ? 'text-light-300' : 'text-light-400'
            }`}
          >
            {formatTime(message.timestamp)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default MessageBubble;