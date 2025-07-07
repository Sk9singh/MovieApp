import React, { useEffect, useState } from 'react';
import { View, Text, Animated } from 'react-native';
import { useWebSocket } from '@/hooks/webSockets';

interface TypingIndicatorProps {
  otherUserName?: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ otherUserName }) => {
  const { typingUsers } = useWebSocket();
  const [dotAnimation] = useState(new Animated.Value(0));
  
  const isTyping = typingUsers.size > 0;

  useEffect(() => {
    if (isTyping) {
      // Animate dots
      Animated.loop(
        Animated.sequence([
          Animated.timing(dotAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(dotAnimation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      dotAnimation.setValue(0);
    }
  }, [isTyping, dotAnimation]);

  if (!isTyping) return null;

  return (
    <View className="px-4 py-2">
      <View className="flex-row items-center">
        <View className="bg-dark-100 px-4 py-2 rounded-2xl rounded-bl-md border border-dark-300">
          <View className="flex-row items-center">
            <Text className="text-light-400 text-sm mr-2">
              {otherUserName || 'Someone'} is typing
            </Text>
            <View className="flex-row">
              <Animated.View
                className="w-1 h-1 bg-light-400 rounded-full mx-0.5"
                style={{
                  opacity: dotAnimation,
                }}
              />
              <Animated.View
                className="w-1 h-1 bg-light-400 rounded-full mx-0.5"
                style={{
                  opacity: dotAnimation,
                }}
              />
              <Animated.View
                className="w-1 h-1 bg-light-400 rounded-full mx-0.5"
                style={{
                  opacity: dotAnimation,
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default TypingIndicator;