import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  FlatList,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { ChevronLeft, MessageCircle, Heart, Share2, MoreHorizontal } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

// Mock user data
const USERS = {
  '1': {
    id: '1',
    name: 'Emma',
    age: 24,
    bio: 'Coffee enthusiast, dog lover, and part-time adventurer. Let\'s explore the city together!',
    images: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
      'https://images.unsplash.com/photo-1484588168347-9d835bb09939'
    ],
    distance: '2 miles away',
    location: 'New York, NY',
    job: 'Marketing Manager',
    education: 'NYU',
    interests: ['Coffee', 'Hiking', 'Photography', 'Dogs'],
    about: 'Looking for someone to explore new coffee shops with and go on weekend adventures. I love my dog Max and taking photos of everything.',
  },
  '2': {
    id: '2',
    name: 'Oliver',
    age: 27,
    bio: 'Professional photographer who loves to travel. Looking for someone to share experiences with.',
    images: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce',
      'https://images.unsplash.com/photo-1568602471122-7832951cc4c5'
    ],
    distance: '5 miles away',
    location: 'Brooklyn, NY',
    job: 'Photographer',
    education: 'School of Visual Arts',
    interests: ['Photography', 'Travel', 'Food', 'Movies'],
    about: 'I travel the world capturing moments. When I\'m not behind the camera, I\'m exploring new restaurants or watching indie films.',
  },
  '3': {
    id: '3',
    name: 'Sophie',
    age: 25,
    bio: 'Art lover and yoga instructor. Enjoy hiking, painting, and relaxing beach days.',
    images: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
      'https://images.unsplash.com/photo-1523264939339-c89f9dadde2e'
    ],
    distance: '1 mile away',
    location: 'Manhattan, NY',
    job: 'Yoga Instructor',
    education: 'Juilliard',
    interests: ['Art', 'Yoga', 'Hiking', 'Beach'],
    about: 'Balance is everything. I teach yoga by day and paint by night. Looking for someone to share peaceful moments with.',
  },
  '4': {
    id: '4',
    name: 'Alexander',
    age: 29,
    bio: 'Chef and foodie who loves trying new restaurants. Also into fitness, books, and indie music.',
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      'https://images.unsplash.com/photo-1499996860823-5214fcc65f8f',
      'https://images.unsplash.com/photo-1492447273231-0f8fecec1e3a'
    ],
    distance: '3 miles away',
    location: 'Queens, NY',
    job: 'Executive Chef',
    education: 'Culinary Institute of America',
    interests: ['Cooking', 'Food', 'Fitness', 'Music'],
    about: 'Food is my passion. I create culinary experiences and believe that good food brings people together. Looking for a dinner companion.',
  },
  '5': {
    id: '5',
    name: 'Jessica',
    age: 26,
    bio: 'Mountain girl at heart. Loves trail running, camping, and exploring nature. Also a big reader.',
    images: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04',
      'https://images.unsplash.com/photo-1488716820095-cbe80883c496'
    ],
    distance: '7 miles away',
    location: 'Hoboken, NJ',
    job: 'Environmental Scientist',
    education: 'Columbia University',
    interests: ['Running', 'Camping', 'Nature', 'Books'],
    about: 'Most weekends you\'ll find me on a trail or with my nose in a book. I\'m passionate about the environment and sustainable living.',
  },
};

export default function ProfileViewScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const params = useLocalSearchParams();
  const [isLiked, setIsLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const userId = params.id as string;
  const user = USERS[userId];
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleLike = () => {
    setIsLiked(!isLiked);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };
  
  const navigateToChat = () => {
    router.push({
      pathname: '/messages/conversation',
      params: { id: userId }
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  if (loading || !user) {
    return (
      <View style={[
        styles.loadingContainer,
        { backgroundColor: theme.colors.background.primary }
      ]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }
  
  return (
    <View style={[
      styles.container,
      { backgroundColor: theme.colors.background.primary }
    ]}>
      <View style={[
        styles.header,
        { 
          paddingTop: insets.top,
          backgroundColor: 'transparent' 
        }
      ]}>
        <TouchableOpacity 
          style={[
            styles.backButton,
            { backgroundColor: 'rgba(0,0,0,0.3)' }
          ]}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={[
              styles.headerActionButton,
              { backgroundColor: 'rgba(0,0,0,0.3)' }
            ]}
          >
            <Share2 size={20} color="#FFFFFF" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.headerActionButton,
              { backgroundColor: 'rgba(0,0,0,0.3)' }
            ]}
          >
            <MoreHorizontal size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
      
      <FlatList
        data={user.images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
          if (newIndex !== currentImageIndex) {
            setCurrentImageIndex(newIndex);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
        }}
        renderItem={({ item }) => (
          <Image 
            source={{ uri: item }} 
            style={styles.image} 
            resizeMode="cover"
          />
        )}
        keyExtractor={(_, index) => index.toString()}
      />
      
      <View style={styles.imageIndicators}>
        {user.images.map((_, index) => (
          <View 
            key={index} 
            style={[
              styles.imageIndicator,
              index === currentImageIndex && styles.activeImageIndicator
            ]} 
          />
        ))}
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.profileHeader}>
          <View>
            <Text style={[
              styles.name,
              { color: theme.colors.text.primary }
            ]}>
              {user.name}, {user.age}
            </Text>
            <Text style={[
              styles.location,
              { color: theme.colors.text.secondary }
            ]}>
              {user.location} • {user.distance}
            </Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            { color: theme.colors.text.primary }
          ]}>
            About
          </Text>
          <Text style={[
            styles.bio,
            { color: theme.colors.text.secondary }
          ]}>
            {user.about || user.bio}
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            { color: theme.colors.text.primary }
          ]}>
            Basics
          </Text>
          <View style={styles.basicInfoRow}>
            <View style={[
              styles.basicInfoItem,
              { backgroundColor: theme.colors.background.tertiary }
            ]}>
              <Text style={[
                styles.basicInfoText,
                { color: theme.colors.text.primary }
              ]}>
                🎓 {user.education}
              </Text>
            </View>
            <View style={[
              styles.basicInfoItem,
              { backgroundColor: theme.colors.background.tertiary }
            ]}>
              <Text style={[
                styles.basicInfoText,
                { color: theme.colors.text.primary }
              ]}>
                💼 {user.job}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            { color: theme.colors.text.primary }
          ]}>
            Interests
          </Text>
          <View style={styles.interestsContainer}>
            {user.interests.map((interest, index) => (
              <View 
                key={index}
                style={[
                  styles.interestBadge,
                  { backgroundColor: theme.colors.background.highlight }
                ]}
              >
                <Text style={[
                  styles.interestText,
                  { color: theme.colors.primary }
                ]}>
                  {interest}
                </Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[
              styles.actionButton,
              styles.likeButton,
              isLiked && { backgroundColor: 'rgba(255, 20, 147, 0.2)' }
            ]}
            onPress={handleLike}
          >
            <Heart 
              size={24} 
              color={theme.colors.primary} 
              fill={isLiked ? theme.colors.primary : 'transparent'} 
            />
            <Text style={[
              styles.actionButtonText,
              { color: theme.colors.primary }
            ]}>
              {isLiked ? 'Liked' : 'Like'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.actionButton,
              styles.messageButton,
              { backgroundColor: theme.colors.primary }
            ]}
            onPress={navigateToChat}
          >
            <MessageCircle size={24} color="#FFFFFF" />
            <Text style={styles.messageButtonText}>Message</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  image: {
    width,
    height: width * 1.2,
  },
  imageIndicators: {
    position: 'absolute',
    top: width * 1.2 - 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 5,
  },
  imageIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activeImageIndicator: {
    width: 16,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    marginTop: -24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: 'inherit',
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
  },
  location: {
    fontSize: 16,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  bio: {
    fontSize: 16,
    lineHeight: 24,
  },
  basicInfoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  basicInfoItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  basicInfoText: {
    fontSize: 14,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  interestText: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    flex: 1,
  },
  likeButton: {
    borderWidth: 1,
    borderColor: '#FF1493',
    marginRight: 8,
  },
  messageButton: {
    marginLeft: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  messageButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});
