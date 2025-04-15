import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface NotificationBadgeProps {
  count?: number;
  size?: number;
  color?: string;
  textColor?: string;
  showZero?: boolean;
}

export default function NotificationBadge({
  count = 0,
  size = 20,
  color,
  textColor = '#FFFFFF',
  showZero = false,
}: NotificationBadgeProps) {
  const { theme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const prevCount = useRef(count);
  
  // Use theme color if not provided
  const badgeColor = color || theme.colors.primary;
  
  useEffect(() => {
    // Only animate if count changes and is greater than 0 (or showZero is true)
    if ((count > 0 || (count === 0 && showZero)) && count !== prevCount.current) {
      // Reset to small
      scaleAnim.setValue(0.5);
      
      // Animate to normal size with a bounce effect
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 100,
        useNativeDriver: true,
      }).start();
      
      prevCount.current = count;
    }
  }, [count, showZero]);
  
  // Don't render if count is 0 and showZero is false
  if (count === 0 && !showZero) {
    return null;
  }
  
  // Format count if it's greater than 99
  const displayCount = count > 99 ? '99+' : count.toString();
  
  // Adjust size based on content
  const width = displayCount.length > 1 ? size * 1.5 : size;
  
  return (
    <Animated.View
      style={[
        styles.badge,
        {
          backgroundColor: badgeColor,
          width,
          height: size,
          borderRadius: size / 2,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Text style={[styles.text, { color: textColor, fontSize: size * 0.6 }]}>
        {displayCount}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  badge: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -5,
    right: -5,
    zIndex: 10,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
});
