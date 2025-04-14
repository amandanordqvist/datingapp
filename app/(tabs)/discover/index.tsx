import { StyleSheet, View, Text, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Heart, X } from 'lucide-react-native';
import { useState, useCallback } from 'react';
import Animated, { 
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withTiming,
  runOnJS
} from 'react-native-reanimated';

const HEADER_HEIGHT = 60;

const PROFILES = [
  {
    id: '1',
    name: 'Sarah',
    age: 28,
    bio: 'Adventure seeker & coffee enthusiast 🌎☕️',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
  },
  {
    id: '2',
    name: 'Emily',
    age: 26,
    bio: 'Art lover, yoga enthusiast 🎨🧘‍♀️',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
  },
  {
    id: '3',
    name: 'Jessica',
    age: 27,
    bio: 'Foodie and travel addict 🍜✈️',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9',
  },
];

export default function DiscoverScreen() {
  const insets = useSafeAreaInsets();
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const currentProfile = PROFILES[currentProfileIndex];
  const swipeDirection = useSharedValue('none');
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const cardScale = useSharedValue(1);
  
  const handleNextProfile = useCallback(() => {
    if (currentProfileIndex < PROFILES.length - 1) {
      setCurrentProfileIndex(prev => prev + 1);
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      cardScale.value = withSpring(1);
      swipeDirection.value = 'none';
    }
  }, [currentProfileIndex]);

  const handleLike = () => {
    translateX.value = withTiming(500, {}, () => {
      runOnJS(handleNextProfile)();
    });
    cardScale.value = withTiming(0.8);
    swipeDirection.value = 'right';
  };

  const handleNope = () => {
    translateX.value = withTiming(-500, {}, () => {
      runOnJS(handleNextProfile)();
    });
    cardScale.value = withTiming(0.8);
    swipeDirection.value = 'left';
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: cardScale.value },
        { rotate: `${(translateX.value / 20)}deg` }
      ]
    };
  });

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 10,
          },
        ]}>
        <Text style={styles.headerTitle}>Discover</Text>
      </View>
      
      <View style={styles.cardContainer}>
        <Animated.View
          style={[styles.card, animatedStyle]}>
          <TouchableOpacity 
            style={styles.cardContent}
            onPress={() => router.push({
              pathname: '/discover/profile-details',
              params: { id: currentProfile.id }
            })}>
            <Image
              source={{
                uri: currentProfile.image,
              }}
              style={styles.cardImage}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.cardGradient}>
              <View style={styles.cardContent}>
                <Text style={styles.cardName}>
                  {currentProfile.name}, {currentProfile.age}
                </Text>
                <Text style={styles.cardBio}>
                  {currentProfile.bio}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
        
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.nopeButton]}
            onPress={handleNope}>
            <X size={32} color="#FF4B4B" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.likeButton]}
            onPress={handleLike}>
            <Heart size={32} color="#FF1493" fill="#FF1493" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    height: HEADER_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardContainer: {
    flex: 1,
    padding: 10,
  },
  card: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#2D2D2D',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
    justifyContent: 'flex-end',
  },
  cardContent: {
    padding: 20,
  },
  cardName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  cardBio: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 20,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2D2D2D',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  nopeButton: {
    backgroundColor: '#2D2D2D',
  },
  likeButton: {
    backgroundColor: '#2D2D2D',
  },
});