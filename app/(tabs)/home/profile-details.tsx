import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { X, MapPin, Briefcase, GraduationCap, Heart } from 'lucide-react-native';
import { useState, useEffect } from 'react';

const PROFILES_DATA = [{
  id: '1',
  name: 'Sarah Anderson',
  age: 28,
  location: 'Stockholm, Sweden',
  occupation: 'UX Designer',
  education: 'KTH Royal Institute of Technology',
  bio: 'Adventure seeker & coffee enthusiast 🌎☕️\nLove exploring new places, trying different cuisines, and capturing moments through photography 📸\n\nLooking for someone who shares my passion for travel and good conversations!',
  interests: ['Travel', 'Photography', 'Coffee', 'Art', 'Hiking', 'Food'],
  images: [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9',
  ]
}, {
  id: '2',
  name: 'Emily Parker',
  age: 26,
  location: 'London, UK',
  occupation: 'Art Curator',
  education: 'Central Saint Martins',
  bio: 'Art lover, yoga enthusiast 🎨🧘‍♀️\nPassionate about contemporary art and mindful living.\n\nLooking for someone to share gallery visits and peaceful moments with.',
  interests: ['Art', 'Yoga', 'Meditation', 'Museums', 'Travel', 'Photography'],
  images: [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330'
  ]
}, {
  id: '3',
  name: 'Jessica Kim',
  age: 27,
  location: 'New York, USA',
  occupation: 'Food Critic',
  education: 'Culinary Institute of America',
  bio: 'Foodie and travel addict 🍜✈️\nAlways in search of the next great meal and adventure.\n\nLet\'s explore the world\'s cuisines together!',
  interests: ['Food', 'Travel', 'Cooking', 'Photography', 'Wine Tasting', 'Languages'],
  images: [
    'https://images.unsplash.com/photo-1517841905240-472988babdf9',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb'
  ]
}];

export default function ProfileDetails() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const [profileData, setProfileData] = useState(PROFILES_DATA[0]);
  
  useEffect(() => {
    if (params.id) {
      const profile = PROFILES_DATA.find(p => p.id === params.id);
      if (profile) setProfileData(profile);
    }
  }, [params.id]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => router.back()}>
            <X size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          horizontal 
          pagingEnabled 
          showsHorizontalScrollIndicator={false}
          style={styles.imageScroller}>
          {profileData.images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={styles.profileImage}
            />
          ))}
        </ScrollView>

        <View style={styles.content}>
          <Text style={styles.name}>{profileData.name}, {profileData.age}</Text>
          
          <View style={styles.infoRow}>
            <MapPin size={20} color="#FF1493" />
            <Text style={styles.infoText}>{profileData.location}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Briefcase size={20} color="#FF1493" />
            <Text style={styles.infoText}>{profileData.occupation}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <GraduationCap size={20} color="#FF1493" />
            <Text style={styles.infoText}>{profileData.education}</Text>
          </View>

          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bio}>{profileData.bio}</Text>

          <Text style={styles.sectionTitle}>Interests</Text>
          <View style={styles.interests}>
            {profileData.interests.map((interest, index) => (
              <View key={index} style={styles.interestTag}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom || 20 }]}>
        <TouchableOpacity style={styles.likeButton}>
          <Heart size={24} color="#fff" fill="#fff" />
          <Text style={styles.likeButtonText}>Like Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171717',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    padding: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageScroller: {
    height: 500,
  },
  profileImage: {
    width: 400,
    height: 500,
  },
  content: {
    padding: 20,
  },
  name: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#fff',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#fff',
    marginLeft: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginTop: 24,
    marginBottom: 12,
  },
  bio: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#D1D5DB',
    lineHeight: 24,
  },
  interests: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  interestTag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#2D2D2D',
    borderRadius: 20,
  },
  interestText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#fff',
  },
  footer: {
    padding: 20,
    backgroundColor: '#1F1F1F',
    borderTopWidth: 1,
    borderTopColor: '#2D2D2D',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF1493',
    padding: 16,
    borderRadius: 16,
  },
  likeButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginLeft: 8,
  },
});