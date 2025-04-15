import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  Animated, 
  ActivityIndicator, 
  View, 
  StyleProp, 
  ViewStyle, 
  TextStyle 
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import * as Haptics from 'expo-haptics';

interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  hapticFeedback?: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'none';
}

export default function AnimatedButton({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  hapticFeedback = 'light',
}: AnimatedButtonProps) {
  const { theme } = useTheme();
  const [scaleAnim] = useState(new Animated.Value(1));
  
  const buttonStyles: StyleProp<ViewStyle>[] = [styles.button];
  const textStyles: StyleProp<TextStyle>[] = [styles.text];
  
  // Size styles
  if (size === 'small') {
    buttonStyles.push(styles.smallButton);
    textStyles.push(styles.smallText);
  } else if (size === 'medium') {
    buttonStyles.push(styles.mediumButton);
    textStyles.push(styles.mediumText);
  } else if (size === 'large') {
    buttonStyles.push(styles.largeButton);
    textStyles.push(styles.largeText);
  }
  
  // Width style
  if (fullWidth) {
    buttonStyles.push(styles.fullWidth);
  }
  
  // Variant styles
  if (!disabled) {
    if (variant === 'primary') {
      buttonStyles.push({ backgroundColor: theme.colors.primary });
      textStyles.push({ color: '#FFFFFF' });
    } else if (variant === 'secondary') {
      buttonStyles.push({ backgroundColor: theme.colors.secondary });
      textStyles.push({ color: '#FFFFFF' });
    } else if (variant === 'outline') {
      buttonStyles.push({ 
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.primary
      });
      textStyles.push({ color: theme.colors.primary });
    } else if (variant === 'ghost') {
      buttonStyles.push({ backgroundColor: 'transparent' });
      textStyles.push({ color: theme.colors.primary });
    }
  } else {
    buttonStyles.push(styles.disabled);
    textStyles.push(styles.disabledText);
  }
  
  // Add custom styles
  if (style) {
    buttonStyles.push(style);
  }
  
  if (textStyle) {
    textStyles.push(textStyle);
  }
  
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      friction: 5,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePress = () => {
    // Trigger haptic feedback
    if (hapticFeedback !== 'none' && !disabled && !loading) {
      switch (hapticFeedback) {
        case 'light':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'medium':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'heavy':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case 'success':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case 'warning':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        case 'error':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
      }
    }
    
    onPress();
  };
  
  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={buttonStyles}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator 
            color={
              variant === 'outline' || variant === 'ghost' 
                ? theme.colors.primary 
                : '#FFFFFF'
            } 
            size="small"
          />
        ) : (
          <View style={styles.contentContainer}>
            {icon && iconPosition === 'left' && (
              <View style={styles.leftIcon}>{icon}</View>
            )}
            <Text style={textStyles}>{title}</Text>
            {icon && iconPosition === 'right' && (
              <View style={styles.rightIcon}>{icon}</View>
            )}
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  fullWidth: {
    width: '100%',
  },
  smallButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    height: 36,
  },
  mediumButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    height: 48,
  },
  largeButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    height: 56,
  },
  disabled: {
    backgroundColor: '#CCCCCC',
    borderColor: '#CCCCCC',
    shadowOpacity: 0,
    elevation: 0,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  smallText: {
    fontSize: 12,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  disabledText: {
    color: '#888888',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});
