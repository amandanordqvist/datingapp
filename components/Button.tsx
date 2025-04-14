import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator, View, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
}: ButtonProps) {
  const { theme } = useTheme();
  
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
      buttonStyles.push(styles.primaryButton);
      textStyles.push(styles.primaryText);
    } else if (variant === 'secondary') {
      buttonStyles.push(styles.secondaryButton);
      textStyles.push(styles.primaryText);
    } else if (variant === 'outline') {
      buttonStyles.push(styles.outlineButton);
      textStyles.push(styles.outlineText);
    } else if (variant === 'ghost') {
      buttonStyles.push(styles.ghostButton);
      textStyles.push(styles.ghostText);
    }
  } else {
    buttonStyles.push(styles.disabled);
    textStyles.push(styles.disabledText);
  }
  
  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={
          variant === 'outline' || variant === 'ghost' 
            ? theme.colors.primary 
            : theme.colors.text.primary
        } />
      ) : (
        <View style={styles.contentContainer}>
          {icon && iconPosition === 'left' && <View style={styles.leftIcon}>{icon}</View>}
          <Text style={textStyles}>{title}</Text>
          {icon && iconPosition === 'right' && <View style={styles.rightIcon}>{icon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  fullWidth: {
    width: '100%',
  },
  smallButton: {
    paddingVertical: 4,
    paddingHorizontal: 16,
    height: 36,
  },
  mediumButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    height: 48,
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    height: 56,
  },
  primaryButton: {
    backgroundColor: '#FF1493',
  },
  secondaryButton: {
    backgroundColor: '#9342F5',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FF1493',
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  disabled: {
    backgroundColor: '#374151',
    borderColor: '#374151',
  },
  text: {
    fontFamily: 'System',
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
  primaryText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: '#FF1493',
  },
  ghostText: {
    color: '#FF1493',
  },
  disabledText: {
    color: '#9CA3AF',
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