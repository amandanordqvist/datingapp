import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Image,
  Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Camera, Plus, X } from 'lucide-react-native';
import { router } from 'expo-router';

const INTERESTS = [
  'Travel', 'Music', 'Art', 'Sports', 'Reading', 'Cooking', 
  'Gaming', 'Movies', 'Dancing', 'Hiking', 'Yoga', 'Photography',
  'Coffee', 'Wine', 'Fitness', 'Technology', 'Fashion', 'Nature'
];

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  
  // Profile state
  const [name, setName] = useState('Alexander');
  const [age, setAge] = useState('28');
  const [bio, setBio] = useState('Professional photographer who loves to travel. Looking for someone to share experiences with.');
  const [job, setJob] = useState('Photographer');
  const [company, setCompany] = useState('Freelance');
  const [education, setEducation] = useState('Art School NYC');
  const [height, setHeight] = useState('6\'2"');
  const [selectedInterests, setSelectedInterests] = useState(['Photography', 'Travel', 'Music', 'Coffee']);
  
  // Placeholder for multiple profile images
  const [images, setImages] = useState([
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
    'https://images.unsplash.com/photo-1540569014015-19a7be504e3a',
    null, // Empty slot for adding a new image
    null,
  ]);
  
  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(item => item !== interest));
    } else if (selectedInterests.length < 5) {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };
  
  const renderPhotoItem = (uri: string | null, index: number) => {
    if (uri) {
      return (
        <View style={styles.photoItem} key={index}>
          <Image source={{ uri }} style={styles.photoImage} />
          <TouchableOpacity 
            style={styles.removePhotoButton}
            onPress={() => {
              const newImages = [...images];
              newImages[index] = null;
              setImages(newImages);
            }}
          >
            <X size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <TouchableOpacity style={styles.addPhotoItem} key={index}>
          <Plus size={24} color="#FF1493" />
          <Text style={styles.addPhotoText}>Add Photo</Text>
        </TouchableOpacity>
      );
    }
  };
  
  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={() => router.back()}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {/* Photos Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photos</Text>
          <Text style={styles.sectionSubtitle}>Add up to 5 photos. Drag to reorder.</Text>
          <View style={styles.photosContainer}>
            {images.map(renderPhotoItem)}
          </View>
        </View>
        
        {/* Basic Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Info</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Age</Text>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={setAge}
              placeholder="Your age"
              keyboardType="number-pad"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Bio</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about yourself"
              multiline
              numberOfLines={4}
            />
          </View>
        </View>
        
        {/* Work & Education Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work & Education</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Job Title</Text>
            <TextInput
              style={styles.input}
              value={job}
              onChangeText={setJob}
              placeholder="What do you do?"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Company</Text>
            <TextInput
              style={styles.input}
              value={company}
              onChangeText={setCompany}
              placeholder="Where do you work?"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Education</Text>
            <TextInput
              style={styles.input}
              value={education}
              onChangeText={setEducation}
              placeholder="Your education"
            />
          </View>
        </View>
        
        {/* Other Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Other Details</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Height</Text>
            <TextInput
              style={styles.input}
              value={height}
              onChangeText={setHeight}
              placeholder="Your height"
            />
          </View>
        </View>
        
        {/* Interests Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interests</Text>
          <Text style={styles.sectionSubtitle}>Select up to 5 interests</Text>
          
          <View style={styles.interestsContainer}>
            {INTERESTS.map(interest => (
              <TouchableOpacity
                key={interest}
                style={[
                  styles.interestBadge,
                  selectedInterests.includes(interest) && styles.selectedInterestBadge
                ]}
                onPress={() => toggleInterest(interest)}
              >
                <Text 
                  style={[
                    styles.interestBadgeText,
                    selectedInterests.includes(interest) && styles.selectedInterestBadgeText
                  ]}
                >
                  {interest}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE'
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF1493'
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 8,
    borderBottomColor: '#F5F5F5'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  photoItem: {
    width: '31%',
    aspectRatio: 1,
    margin: '1%',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative'
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  removePhotoButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoItem: {
    width: '31%',
    aspectRatio: 1,
    margin: '1%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoText: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: '#444444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  interestBadge: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    margin: 4,
  },
  selectedInterestBadge: {
    backgroundColor: '#FFE6F5',
  },
  interestBadgeText: {
    fontSize: 14,
    color: '#444444',
  },
  selectedInterestBadgeText: {
    color: '#FF1493',
    fontWeight: '500',
  }
}); 