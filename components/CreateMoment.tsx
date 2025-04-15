import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  Modal, 
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { X, Camera, Image as ImageIcon, Send } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

interface CreateMomentProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (caption: string, imageUri: string) => Promise<void>;
}

export default function CreateMoment({
  visible,
  onClose,
  onSubmit
}: CreateMomentProps) {
  const { theme, isDark } = useTheme();
  const [caption, setCaption] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // In a real app, this would use expo-camera or expo-image-picker
  // For this demo, we'll use placeholder images
  const placeholderImages = [
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac',
    'https://images.unsplash.com/photo-1516298773066-c48f8e9bd92b',
    'https://images.unsplash.com/photo-1471922694854-ff1b63b20054',
    'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee'
  ];
  
  const selectRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * placeholderImages.length);
    setImageUri(placeholderImages[randomIndex]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  const handleSubmit = async () => {
    if (!imageUri) {
      Alert.alert('Error', 'Please select an image first');
      return;
    }
    
    try {
      setIsLoading(true);
      await onSubmit(caption, imageUri);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Reset form
      setCaption('');
      setImageUri(null);
      
      // Close modal
      onClose();
    } catch (error) {
      console.error('Error creating moment:', error);
      Alert.alert('Error', 'Failed to create moment. Please try again.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <BlurView 
          intensity={90} 
          tint={isDark ? 'dark' : 'light'}
          style={styles.blurContainer}
        >
          <View style={[
            styles.content,
            { backgroundColor: isDark ? '#1F1F1F' : '#FFFFFF' }
          ]}>
            <View style={styles.header}>
              <Text style={[
                styles.title,
                { color: theme.colors.text.primary }
              ]}>
                Create Moment
              </Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={onClose}
              >
                <X size={24} color={theme.colors.text.primary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.imageSection}>
              {imageUri ? (
                <View style={styles.selectedImageContainer}>
                  <Image 
                    source={{ uri: imageUri }} 
                    style={styles.selectedImage} 
                    resizeMode="cover"
                  />
                  <TouchableOpacity 
                    style={styles.removeImageButton}
                    onPress={() => setImageUri(null)}
                  >
                    <X size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.imageOptions}>
                  <TouchableOpacity 
                    style={[
                      styles.imageOptionButton,
                      { backgroundColor: theme.colors.background.tertiary }
                    ]}
                    onPress={() => {
                      // In a real app, this would open the camera
                      Alert.alert('Camera', 'This would open the camera in a real app');
                    }}
                  >
                    <Camera size={32} color={theme.colors.primary} />
                    <Text style={[
                      styles.imageOptionText,
                      { color: theme.colors.text.primary }
                    ]}>
                      Camera
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      styles.imageOptionButton,
                      { backgroundColor: theme.colors.background.tertiary }
                    ]}
                    onPress={selectRandomImage}
                  >
                    <ImageIcon size={32} color={theme.colors.primary} />
                    <Text style={[
                      styles.imageOptionText,
                      { color: theme.colors.text.primary }
                    ]}>
                      Gallery
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            
            <View style={styles.captionSection}>
              <TextInput
                style={[
                  styles.captionInput,
                  { 
                    color: theme.colors.text.primary,
                    backgroundColor: theme.colors.background.tertiary
                  }
                ]}
                placeholder="Write a caption..."
                placeholderTextColor={theme.colors.text.secondary}
                value={caption}
                onChangeText={setCaption}
                multiline
                maxLength={150}
              />
              <Text style={[
                styles.characterCount,
                { color: theme.colors.text.secondary }
              ]}>
                {caption.length}/150
              </Text>
            </View>
            
            <TouchableOpacity 
              style={[
                styles.submitButton,
                { 
                  backgroundColor: theme.colors.primary,
                  opacity: (!imageUri || isLoading) ? 0.7 : 1
                }
              ]}
              onPress={handleSubmit}
              disabled={!imageUri || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Send size={20} color="#FFFFFF" style={styles.submitIcon} />
                  <Text style={styles.submitText}>Share Moment</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </BlurView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blurContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  content: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    padding: 8,
  },
  imageSection: {
    marginBottom: 20,
  },
  imageOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  imageOptionButton: {
    width: 120,
    height: 120,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageOptionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  selectedImageContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    height: 250,
  },
  selectedImage: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captionSection: {
    marginBottom: 20,
  },
  captionInput: {
    borderRadius: 12,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  characterCount: {
    fontSize: 12,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 14,
  },
  submitIcon: {
    marginRight: 8,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
