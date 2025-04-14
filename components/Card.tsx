import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Heart } from 'lucide-react-native';

interface CardProps {
  image: string;
  name: string;
  age: number;
  distance?: string;
  bio?: string;
  interests?: string[];
  onPress?: () => void;
  onLike?: () => void;
  style?: StyleProp<ViewStyle>;
  liked?: boolean;
}

export default function Card({
  image,
  name,
  age,
  distance,
  bio,
  interests,
  onPress,
  onLike,
  style,
  liked = false,
}: CardProps) {
  const { theme } = useTheme();
  
  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      activeOpacity={0.95}
      onPress={onPress}
    >
      <Image source={{ uri: image }} style={styles.image} />
      
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View>
              <Text style={styles.name}>
                {name}, {age}
              </Text>
              {distance && (
                <Text style={styles.distance}>{distance}</Text>
              )}
            </View>
            
            {onLike && (
              <TouchableOpacity 
                style={[styles.likeButton, liked && styles.likedButton]} 
                onPress={onLike}
              >
                <Heart 
                  size={20} 
                  color={liked ? theme.colors.text.primary : theme.colors.primary} 
                  fill={liked ? theme.colors.primary : 'transparent'} 
                />
              </TouchableOpacity>
            )}
          </View>
          
          {bio && <Text style={styles.bio} numberOfLines={2}>{bio}</Text>}
          
          {interests && interests.length > 0 && (
            <View style={styles.interestsContainer}>
              {interests.map((interest, index) => (
                <View key={index} style={styles.interestTag}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 480,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  name: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  distance: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
  },
  likeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  likedButton: {
    backgroundColor: '#FF1493',
  },
  bio: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 16,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  interestTag: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  interestText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
}); 