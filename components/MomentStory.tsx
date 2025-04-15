import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const STORY_SIZE = width * 0.25;

interface MomentStoryProps {
  image: string;
  name: string;
  isNew?: boolean;
  isViewed?: boolean;
  onPress: () => void;
}

export default function MomentStory({
  image,
  name,
  isNew = false,
  isViewed = false,
  onPress,
}: MomentStoryProps) {
  const { theme } = useTheme();
  
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[
        styles.storyRing,
        isViewed 
          ? { borderColor: theme.colors.gray[400] } 
          : { borderColor: theme.colors.primary }
      ]}>
        <Image 
          source={{ uri: image }} 
          style={styles.image} 
          resizeMode="cover"
        />
        
        {isNew && (
          <View style={[
            styles.badge,
            { backgroundColor: theme.colors.primary }
          ]}>
            <Text style={styles.badgeText}>NEW</Text>
          </View>
        )}
      </View>
      
      <Text 
        style={[
          styles.name,
          { color: theme.colors.text.primary }
        ]}
        numberOfLines={1}
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 6,
    width: STORY_SIZE,
  },
  storyRing: {
    width: STORY_SIZE,
    height: STORY_SIZE,
    borderRadius: STORY_SIZE / 2,
    borderWidth: 2,
    padding: 2,
    marginBottom: 4,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: (STORY_SIZE - 4) / 2,
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 12,
    textAlign: 'center',
    width: STORY_SIZE,
  },
});
