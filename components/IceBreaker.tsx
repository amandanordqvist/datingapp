import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  FlatList,
  Dimensions,
  Animated,
  Easing
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { X, MessageSquare, Send, Shuffle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

// Ice breaker questions/prompts
const ICE_BREAKERS = [
  "What's your idea of a perfect weekend?",
  "If you could travel anywhere right now, where would you go?",
  "What's the best meal you've ever had?",
  "What's one thing you're passionate about?",
  "What's your favorite way to relax after a long day?",
  "What's the last book you read or show you binged?",
  "If you could have dinner with anyone, who would it be?",
  "What's something you've always wanted to try?",
  "Beach vacation or mountain getaway?",
  "What's your go-to karaoke song?",
  "Morning person or night owl?",
  "What's your favorite childhood memory?",
  "If you could have any superpower, what would it be?",
  "What's something that made you smile today?",
  "Coffee or tea?",
  "What's your favorite way to stay active?",
  "What's the best advice you've ever received?",
  "What's your favorite season and why?",
  "If you could master any skill instantly, what would it be?",
  "What's your favorite way to spend a rainy day?"
];

interface IceBreakerProps {
  onSend: (message: string) => void;
}

export default function IceBreaker({ onSend }: IceBreakerProps) {
  const { theme, isDark } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIceBreaker, setSelectedIceBreaker] = useState<string | null>(null);
  const [currentIceBreakers, setCurrentIceBreakers] = useState(() => {
    // Get 5 random ice breakers
    return getRandomIceBreakers(5);
  });
  
  const spinValue = new Animated.Value(0);
  
  // Function to get random ice breakers
  function getRandomIceBreakers(count: number) {
    const shuffled = [...ICE_BREAKERS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
  
  const refreshIceBreakers = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Animate the shuffle icon
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 500,
      easing: Easing.bounce,
      useNativeDriver: true,
    }).start(() => {
      spinValue.setValue(0);
    });
    
    setCurrentIceBreakers(getRandomIceBreakers(5));
  };
  
  const handleSelectIceBreaker = (iceBreaker: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedIceBreaker(iceBreaker);
  };
  
  const handleSendIceBreaker = () => {
    if (selectedIceBreaker) {
      onSend(selectedIceBreaker);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setModalVisible(false);
      setSelectedIceBreaker(null);
    }
  };
  
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  return (
    <>
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: theme.colors.background.tertiary }
        ]}
        onPress={() => setModalVisible(true)}
      >
        <MessageSquare size={20} color={theme.colors.text.secondary} />
        <Text style={[
          styles.buttonText,
          { color: theme.colors.text.secondary }
        ]}>
          Ice Breakers
        </Text>
      </TouchableOpacity>
      
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <BlurView
          intensity={90}
          tint={isDark ? 'dark' : 'light'}
          style={styles.modalContainer}
        >
          <View style={[
            styles.modalContent,
            { backgroundColor: theme.colors.background.secondary }
          ]}>
            <View style={styles.modalHeader}>
              <Text style={[
                styles.modalTitle,
                { color: theme.colors.text.primary }
              ]}>
                Ice Breakers
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <X size={24} color={theme.colors.text.primary} />
              </TouchableOpacity>
            </View>
            
            <Text style={[
              styles.modalSubtitle,
              { color: theme.colors.text.secondary }
            ]}>
              Select a conversation starter to break the ice
            </Text>
            
            <View style={styles.refreshContainer}>
              <TouchableOpacity
                style={[
                  styles.refreshButton,
                  { backgroundColor: theme.colors.background.tertiary }
                ]}
                onPress={refreshIceBreakers}
              >
                <Animated.View style={{ transform: [{ rotate: spin }] }}>
                  <Shuffle size={20} color={theme.colors.text.secondary} />
                </Animated.View>
                <Text style={[
                  styles.refreshText,
                  { color: theme.colors.text.secondary }
                ]}>
                  Shuffle
                </Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={currentIceBreakers}
              keyExtractor={(item, index) => `icebreaker-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.iceBreakerItem,
                    {
                      backgroundColor: selectedIceBreaker === item
                        ? theme.colors.background.highlight
                        : theme.colors.background.tertiary
                    }
                  ]}
                  onPress={() => handleSelectIceBreaker(item)}
                >
                  <Text style={[
                    styles.iceBreakerText,
                    {
                      color: selectedIceBreaker === item
                        ? theme.colors.primary
                        : theme.colors.text.primary
                    }
                  ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.listContent}
            />
            
            <TouchableOpacity
              style={[
                styles.sendButton,
                {
                  backgroundColor: theme.colors.primary,
                  opacity: selectedIceBreaker ? 1 : 0.5
                }
              ]}
              onPress={handleSendIceBreaker}
              disabled={!selectedIceBreaker}
            >
              <Send size={20} color="#FFFFFF" style={styles.sendIcon} />
              <Text style={styles.sendText}>Send Ice Breaker</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    padding: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  refreshContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  refreshText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  listContent: {
    paddingBottom: 20,
  },
  iceBreakerItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  iceBreakerText: {
    fontSize: 16,
    lineHeight: 22,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  sendIcon: {
    marginRight: 8,
  },
  sendText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
