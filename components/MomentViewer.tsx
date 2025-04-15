import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  Dimensions, 
  Modal,
  Animated,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { X, Heart, Send, MessageCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

interface Story {
  id: string;
  userId: string;
  userName: string;
  userImage: string;
  image: string;
  caption?: string;
  timestamp: string;
  likes: number;
  hasLiked?: boolean;
}

interface MomentViewerProps {
  visible: boolean;
  stories: Story[];
  initialStoryIndex?: number;
  onClose: () => void;
  onLike: (storyId: string) => void;
  onReply: (storyId: string, message: string) => void;
}

export default function MomentViewer({
  visible,
  stories,
  initialStoryIndex = 0,
  onClose,
  onLike,
  onReply
}: MomentViewerProps) {
  const { theme, isDark } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(initialStoryIndex);
  const [replyText, setReplyText] = useState('');
  const [showReplyInput, setShowReplyInput] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const storyTimeout = useRef<NodeJS.Timeout | null>(null);
  
  const currentStory = stories[currentIndex];
  
  // Reset progress when story changes
  useEffect(() => {
    progressAnim.setValue(0);
    startProgress();
    
    return () => {
      if (storyTimeout.current) {
        clearTimeout(storyTimeout.current);
      }
    };
  }, [currentIndex, visible]);
  
  const startProgress = () => {
    if (storyTimeout.current) {
      clearTimeout(storyTimeout.current);
    }
    
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 5000, // 5 seconds per story
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        goToNextStory();
      }
    });
    
    // Backup timeout in case animation fails
    storyTimeout.current = setTimeout(goToNextStory, 5000);
  };
  
  const goToPrevStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      onClose();
    }
  };
  
  const goToNextStory = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };
  
  const handleLike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onLike(currentStory.id);
  };
  
  const handleReply = () => {
    if (replyText.trim()) {
      onReply(currentStory.id, replyText);
      setReplyText('');
      setShowReplyInput(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };
  
  if (!visible || !currentStory) return null;
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.storyContainer}>
          {/* Progress bar */}
          <View style={styles.progressContainer}>
            {stories.map((_, index) => (
              <View key={index} style={styles.progressBar}>
                <Animated.View 
                  style={[
                    styles.progressFill,
                    { 
                      backgroundColor: theme.colors.primary,
                      width: index === currentIndex 
                        ? progressAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0%', '100%'],
                          })
                        : index < currentIndex ? '100%' : '0%'
                    }
                  ]} 
                />
              </View>
            ))}
          </View>
          
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.userInfo}>
              <Image 
                source={{ uri: currentStory.userImage }} 
                style={styles.userImage} 
              />
              <View>
                <Text style={[styles.userName, { color: '#FFFFFF' }]}>
                  {currentStory.userName}
                </Text>
                <Text style={styles.timestamp}>{currentStory.timestamp}</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={onClose}
            >
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          {/* Story image */}
          <Image 
            source={{ uri: currentStory.image }} 
            style={styles.storyImage} 
            resizeMode="cover"
          />
          
          {/* Touch areas for navigation */}
          <TouchableOpacity 
            style={styles.prevArea} 
            onPress={goToPrevStory}
            activeOpacity={1}
          />
          <TouchableOpacity 
            style={styles.nextArea} 
            onPress={goToNextStory}
            activeOpacity={1}
          />
          
          {/* Caption */}
          {currentStory.caption && (
            <View style={styles.captionContainer}>
              <Text style={styles.caption}>{currentStory.caption}</Text>
            </View>
          )}
          
          {/* Actions */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleLike}
            >
              <Heart 
                size={24} 
                color="#FFFFFF" 
                fill={currentStory.hasLiked ? '#FF1493' : 'transparent'} 
              />
              <Text style={styles.actionText}>{currentStory.likes}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setShowReplyInput(true)}
            >
              <MessageCircle size={24} color="#FFFFFF" />
              <Text style={styles.actionText}>Reply</Text>
            </TouchableOpacity>
          </View>
          
          {/* Reply input */}
          {showReplyInput && (
            <BlurView 
              intensity={80} 
              tint={isDark ? 'dark' : 'light'}
              style={styles.replyContainer}
            >
              <View style={[
                styles.replyInputContainer,
                { backgroundColor: isDark ? '#2A2A2A' : '#F0F0F0' }
              ]}>
                <TextInput
                  style={[
                    styles.replyInput,
                    { color: theme.colors.text.primary }
                  ]}
                  placeholder="Send a message..."
                  placeholderTextColor={theme.colors.text.secondary}
                  value={replyText}
                  onChangeText={setReplyText}
                  autoFocus
                />
                <TouchableOpacity 
                  style={[
                    styles.sendButton,
                    { backgroundColor: theme.colors.primary }
                  ]}
                  onPress={handleReply}
                >
                  <Send size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => {
                  setShowReplyInput(false);
                  setReplyText('');
                }}
              >
                <Text style={[
                  styles.cancelText,
                  { color: theme.colors.text.primary }
                ]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </BlurView>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  storyContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
    zIndex: 10,
  },
  progressBar: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 2,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  header: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  closeButton: {
    padding: 8,
  },
  storyImage: {
    width,
    height: height * 0.8,
    resizeMode: 'contain',
  },
  prevArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '30%',
    height: '100%',
    zIndex: 5,
  },
  nextArea: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '70%',
    height: '100%',
    zIndex: 5,
  },
  captionContainer: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    padding: 12,
  },
  caption: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
  },
  actionsContainer: {
    position: 'absolute',
    bottom: 40,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 6,
  },
  replyContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 30,
  },
  replyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  replyInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  cancelButton: {
    alignSelf: 'center',
    marginTop: 16,
    padding: 8,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
