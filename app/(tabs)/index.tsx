import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Animated, PanResponder, Image, TouchableOpacity, Dimensions, SafeAreaView, FlatList, Modal, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heart, X, Star, MessageCircle, Sliders as Filter, ChevronLeft, Share2, MoreHorizontal } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { router } from 'expo-router';
import MomentsRow from '@/components/MomentsRow';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const SWIPE_OUT_DURATION = 250;

// Theme constants
const THEME = {
  colors: {
    primary: '#FF1493',
    background: '#F5F5F5',
    text: '#333333',
    textSecondary: '#666666',
    white: '#FFFFFF',
  }
};

// Enhanced profile data for swiping with more pictures and details
const PROFILES = [
  {
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
  {
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
  {
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
  {
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
  {
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
];

export default function DiscoverScreen() {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const [profiles, setProfiles] = useState(PROFILES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedProfiles, setLikedProfiles] = useState<string[]>([]);
  const [superlikedProfiles, setSuperlikedProfiles] = useState<string[]>([]);
  const [dislikedProfiles, setDislikedProfiles] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showProfileDetail, setShowProfileDetail] = useState(false);
  const position = useRef(new Animated.ValueXY()).current;
  const rotation = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });
  
  // Reset image index when changing profiles
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [currentIndex]);
  
  const likeOpacity = position.x.interpolate({
    inputRange: [25, 150],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  
  const dislikeOpacity = position.x.interpolate({
    inputRange: [-150, -25],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  
  const nextCardOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0.7, 1],
    extrapolate: 'clamp',
  });
  
  const nextCardScale = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0.9, 1],
    extrapolate: 'clamp',
  });
  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          swipeRight();
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          swipeLeft();
        } else {
          resetPosition();
        }
      },
    })
  ).current;
  
  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 4,
      useNativeDriver: false,
    }).start();
  };
  
  const swipeRight = () => {
    const currentProfile = profiles[currentIndex];
    setLikedProfiles([...likedProfiles, currentProfile.id]);
    
    Animated.timing(position, {
      toValue: { x: SCREEN_WIDTH + 100, y: 0 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false,
    }).start(() => {
      advanceToNextCard();
    });
  };
  
  const swipeLeft = () => {
    const currentProfile = profiles[currentIndex];
    setDislikedProfiles([...dislikedProfiles, currentProfile.id]);
    
    Animated.timing(position, {
      toValue: { x: -SCREEN_WIDTH - 100, y: 0 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false,
    }).start(() => {
      advanceToNextCard();
    });
  };
  
  const superLike = () => {
    const currentProfile = profiles[currentIndex];
    setSuperlikedProfiles([...superlikedProfiles, currentProfile.id]);
    
    Animated.timing(position, {
      toValue: { x: 0, y: -SCREEN_HEIGHT - 100 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false,
    }).start(() => {
      advanceToNextCard();
    });
  };
  
  const advanceToNextCard = () => {
    setCurrentIndex(prevIndex => prevIndex + 1);
    position.setValue({ x: 0, y: 0 });
  };
  
  const goToNextImage = () => {
    if (!profiles[currentIndex]) return;
    const imagesCount = profiles[currentIndex].images.length;
    
    if (currentImageIndex < imagesCount - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };
  
  const goToPrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };
  
  const viewMatches = () => {
    router.push('/matches');
  };
  
  const openProfile = () => {
    setShowProfileDetail(true);
  };
  
  const renderProfileDetail = () => {
    if (currentIndex >= profiles.length) return null;
    
    const profile = profiles[currentIndex];
    
    return (
      <Modal
        visible={showProfileDetail}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowProfileDetail(false)}
      >
        <SafeAreaView style={[
          styles.modalContainer,
          { backgroundColor: theme.colors.background.primary }
        ]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              style={styles.modalBackButton}
              onPress={() => setShowProfileDetail(false)}
            >
              <ChevronLeft size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
            <Text style={[
              styles.modalTitle,
              { color: theme.colors.text.primary }
            ]}>
              {profile.name}
            </Text>
            <TouchableOpacity style={styles.modalActionButton}>
              <Share2 size={22} color={theme.colors.text.primary} />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={profile.images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Image 
                source={{ uri: item }} 
                style={styles.modalImage} 
                resizeMode="cover"
              />
            )}
            keyExtractor={(_, index) => index.toString()}
          />
          
          <View style={[
            styles.modalContent,
            { backgroundColor: theme.colors.background.secondary }
          ]}>
            <View style={styles.profileHeaderSection}>
              <View>
                <Text style={[
                  styles.profileName,
                  { color: theme.colors.text.primary }
                ]}>
                  {profile.name}, {profile.age}
                </Text>
                <Text style={[
                  styles.profileLocation,
                  { color: theme.colors.text.secondary }
                ]}>
                  {profile.location} • {profile.distance}
                </Text>
              </View>
              <TouchableOpacity style={styles.moreButton}>
                <MoreHorizontal size={24} color={theme.colors.text.secondary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.profileSection}>
              <Text style={[
                styles.sectionTitle,
                { color: theme.colors.text.primary }
              ]}>
                About
              </Text>
              <Text style={[
                styles.aboutText,
                { color: theme.colors.text.secondary }
              ]}>
                {profile.about || profile.bio}
              </Text>
            </View>
            
            <View style={styles.profileSection}>
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
                    🎓 {profile.education}
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
                    💼 {profile.job}
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.profileSection}>
              <Text style={[
                styles.sectionTitle,
                { color: theme.colors.text.primary }
              ]}>
                Interests
              </Text>
              <View style={styles.interestsContainer}>
                {profile.interests.map((interest, index) => (
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
            
            <View style={styles.actionsContainer}>
              <TouchableOpacity 
                style={[
                  styles.actionButton,
                  { backgroundColor: theme.colors.background.secondary }
                ]} 
                onPress={() => {
                  setShowProfileDetail(false);
                  swipeLeft();
                }}
              >
                <X size={26} color={theme.colors.interactive.dislike} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.actionButtonStar,
                  { backgroundColor: theme.colors.background.secondary }
                ]} 
                onPress={() => {
                  setShowProfileDetail(false);
                  superLike();
                }}
              >
                <Star size={26} color={theme.colors.interactive.superlike} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.actionButton,
                  { backgroundColor: theme.colors.background.secondary }
                ]} 
                onPress={() => {
                  setShowProfileDetail(false);
                  swipeRight();
                }}
              >
                <Heart size={26} color={theme.colors.interactive.like} />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    );
  };
  
  const renderNoMoreCards = () => {
    return (
      <View style={[
        styles.noMoreCardsContainer,
        { backgroundColor: theme.colors.background.secondary }
      ]}>
        <View style={[
          styles.emptyStateIcon,
          { backgroundColor: theme.colors.background.highlight }
        ]}>
          <Heart size={60} color={theme.colors.primary} />
        </View>
        <Text style={[
          styles.noMoreCardsTitle,
          { color: theme.colors.text.primary }
        ]}>No more profiles</Text>
        <Text style={[
          styles.noMoreCardsText,
          { color: theme.colors.text.secondary }
        ]}>
          We're working on finding more people near you. Check back soon!
        </Text>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={() => setCurrentIndex(0)}
        >
          <Text style={styles.refreshButtonText}>Start Over</Text>
        </TouchableOpacity>
        
        {/* View matches button */}
        <TouchableOpacity 
          style={[
            styles.viewMatchesButton,
            { borderColor: theme.colors.primary }
          ]}
          onPress={viewMatches}
        >
          <Text style={[
            styles.viewMatchesText,
            { color: theme.colors.primary }
          ]}>View Your Matches</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  const renderCards = () => {
    if (currentIndex >= profiles.length) {
      return renderNoMoreCards();
    }
    
    return profiles
      .map((profile, index) => {
        if (index < currentIndex) {
          return null;
        }
        
        if (index === currentIndex) {
          const currentProfile = profiles[currentIndex];
          const currentImage = currentProfile.images[currentImageIndex];
          
          return (
            <Animated.View
              key={profile.id}
              style={[
                styles.card,
                {
                  transform: [
                    { rotate: rotation },
                    ...position.getTranslateTransform(),
                  ],
                  backgroundColor: theme.colors.background.secondary
                },
              ]}
              {...panResponder.panHandlers}
            >
              <Animated.View style={[styles.likeContainer, { opacity: likeOpacity }]}>
                <Text style={styles.likeText}>LIKE</Text>
              </Animated.View>
              <Animated.View style={[styles.dislikeContainer, { opacity: dislikeOpacity }]}>
                <Text style={styles.dislikeText}>NOPE</Text>
              </Animated.View>
              
              {/* Image navigation UI */}
              <View style={styles.imageNavContainer}>
                {currentProfile.images.map((_, i) => (
                  <TouchableOpacity 
                    key={i}
                    style={[
                      styles.imageDot,
                      i === currentImageIndex && styles.imageDotActive
                    ]}
                    onPress={() => setCurrentImageIndex(i)}
                  />
                ))}
              </View>
              
              {/* Navigation left/right areas */}
              <TouchableOpacity 
                style={styles.prevImageArea} 
                onPress={goToPrevImage}
                activeOpacity={1}
              />
              <TouchableOpacity 
                style={styles.nextImageArea} 
                onPress={goToNextImage}
                activeOpacity={1}
              />
              
              <Image 
                source={{ uri: currentImage }} 
                style={styles.cardImage} 
                resizeMode="cover"
              />
              
              {/* Profile Info */}
              <View style={styles.cardDetails}>
                <View style={styles.nameAgeContainer}>
                  <Text style={[
                    styles.nameText,
                    { color: theme.colors.text.primary }
                  ]}>{profile.name}, {profile.age}</Text>
                  <Text style={[
                    styles.jobText,
                    { color: theme.colors.text.secondary }
                  ]}>{profile.job}</Text>
                  <Text style={[
                    styles.distanceText,
                    { color: theme.colors.text.secondary }
                  ]}>{profile.distance}</Text>
                </View>
                
                <TouchableOpacity 
                  style={[
                    styles.viewProfileButton,
                    { backgroundColor: theme.colors.primary }
                  ]}
                  onPress={openProfile}
                >
                  <Text style={styles.viewProfileText}>View Profile</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          );
        }
        
        if (index === currentIndex + 1) {
          return (
            <Animated.View
              key={profile.id}
              style={[
                styles.card,
                {
                  transform: [{ scale: nextCardScale }],
                  opacity: nextCardOpacity,
                  backgroundColor: theme.colors.background.secondary
                },
                styles.nextCard,
              ]}
            >
              <Image 
                source={{ uri: profile.images[0] }} 
                style={styles.cardImage} 
                resizeMode="cover"
              />
              <View style={styles.cardDetails}>
                <View style={styles.nameAgeContainer}>
                  <Text style={[
                    styles.nameText,
                    { color: theme.colors.text.primary }
                  ]}>{profile.name}, {profile.age}</Text>
                  <Text style={[
                    styles.distanceText,
                    { color: theme.colors.text.secondary }
                  ]}>{profile.distance}</Text>
                </View>
              </View>
            </Animated.View>
          );
        }
        
        return null;
      })
      .reverse();
  };
  
  return (
    <SafeAreaView style={[
      styles.container, 
      { 
        paddingTop: insets.top,
        backgroundColor: theme.colors.background.primary
      }
    ]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[
            styles.headerTitle,
            { color: theme.colors.text.primary }
          ]}>Discover</Text>
          <TouchableOpacity style={[
            styles.filterButton,
            { backgroundColor: theme.colors.background.secondary }
          ]}>
            <Filter size={22} color={theme.colors.text.primary} />
          </TouchableOpacity>
        </View>
        
        {/* Moments Row */}
        <MomentsRow />
        
        <View style={styles.cardsContainer}>{renderCards()}</View>
      </ScrollView>
      {currentIndex < profiles.length && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[
              styles.actionButton,
              { backgroundColor: theme.colors.background.secondary }
            ]} 
            onPress={swipeLeft}
          >
            <X size={26} color={theme.colors.interactive.dislike} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.actionButtonStar,
              { backgroundColor: theme.colors.background.secondary }
            ]} 
            onPress={superLike}
          >
            <Star size={26} color={theme.colors.interactive.superlike} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.actionButton,
              { backgroundColor: theme.colors.background.secondary }
            ]} 
            onPress={swipeRight}
          >
            <Heart size={26} color={theme.colors.interactive.like} />
          </TouchableOpacity>
        </View>
      )}
      {renderProfileDetail()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardsContainer: {
    height: SCREEN_HEIGHT * 0.65,
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.65,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  nextCard: {
    top: 10,
  },
  cardImage: {
    width: '100%',
    height: '75%',
    resizeMode: 'cover',
  },
  cardDetails: {
    padding: 16,
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameAgeContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 22,
    fontWeight: '700',
  },
  jobText: {
    fontSize: 16,
    marginVertical: 2,
  },
  distanceText: {
    fontSize: 14,
    marginTop: 2,
  },
  viewProfileButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  viewProfileText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
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
  imageNavContainer: {
    position: 'absolute',
    top: 16,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  imageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  imageDotActive: {
    backgroundColor: '#FFFFFF',
    width: 16,
  },
  prevImageArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '30%',
    height: '75%',
    zIndex: 5,
  },
  nextImageArea: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '70%',
    height: '75%',
    zIndex: 5,
  },
  likeContainer: {
    position: 'absolute',
    top: 50,
    left: 40,
    transform: [{ rotate: '-20deg' }],
    zIndex: 1000,
    borderWidth: 3,
    borderColor: '#43D854',
    backgroundColor: 'rgba(67, 216, 84, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 10,
  },
  likeText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#43D854',
  },
  dislikeContainer: {
    position: 'absolute',
    top: 50,
    right: 40,
    transform: [{ rotate: '20deg' }],
    zIndex: 1000,
    borderWidth: 3,
    borderColor: '#FE3C72',
    backgroundColor: 'rgba(254, 60, 114, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 10,
  },
  dislikeText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FE3C72',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  actionButtonStar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  noMoreCardsContainer: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.65,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyStateIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  noMoreCardsTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  noMoreCardsText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  refreshButton: {
    backgroundColor: '#FF1493',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    marginBottom: 16,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  viewMatchesButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    borderWidth: 1,
  },
  viewMatchesText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  modalBackButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalActionButton: {
    padding: 8,
  },
  modalImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.2,
  },
  modalContent: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  profileHeaderSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
  },
  profileLocation: {
    fontSize: 16,
    marginTop: 4,
  },
  moreButton: {
    padding: 8,
  },
  profileSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  aboutText: {
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
});
