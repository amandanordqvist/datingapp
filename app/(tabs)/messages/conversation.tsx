import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Image, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Send, Smile, Image as ImageIcon, Camera, Paperclip, Mic } from 'lucide-react-native';
import { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/app/_layout';

interface Message {
  id: number;
  text: string;
  sender: 'me' | 'them';
  time: string;
  read?: boolean;
  media?: string;
  timestamp?: number;
}

interface MessagesData {
  [key: string]: Message[];
}

interface ChatUser {
  id: string;
  name: string;
  image: string;
  online?: boolean;
  lastActive?: string;
}

// Mock data
const CHAT_USERS: Record<string, ChatUser> = {
  '1': {
    id: '1',
    name: 'Emma',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    online: true,
  },
  '2': {
    id: '2',
    name: 'Oliver',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    online: false,
    lastActive: '2h ago',
  },
  '3': {
    id: '3',
    name: 'Sophie',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    online: true,
  },
};

const MESSAGES: MessagesData = {
  '1': [
    { id: 1, text: "Hey! I saw we matched 😊", sender: 'them', time: '10:30 AM', read: true },
    { id: 2, text: "Hi! Yes, I love your profile! Especially the coffee enthusiasm 😄", sender: 'me', time: '10:32 AM', read: true },
    { id: 3, text: "Thanks! I know this amazing coffee place downtown. Would you like to grab a cup sometime?", sender: 'them', time: '10:35 AM', read: true },
    { id: 4, text: "That sounds great! I'm free this weekend if that works for you?", sender: 'me', time: '10:40 AM', read: true },
    { id: 5, text: "Perfect! How about Saturday around 2pm?", sender: 'them', time: '10:45 AM', read: true },
    { id: 6, text: "Here's the place I was talking about", sender: 'them', time: '10:46 AM', read: true, media: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24' },
  ],
  '2': [
    { id: 1, text: "Hi there! I noticed you're into photography too!", sender: 'them', time: '2:15 PM', read: true },
    { id: 2, text: "Yes! I love capturing moments. What's your favorite subject to shoot?", sender: 'me', time: '2:20 PM', read: true },
    { id: 3, text: "I mostly do landscapes and street photography. Here's one of my recent shots", sender: 'them', time: '2:25 PM', read: true, media: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9' },
  ],
  '3': [
    { id: 1, text: "Hello! Your travel photos are amazing!", sender: 'them', time: '5:45 PM', read: true },
    { id: 2, text: "Thank you! I just got back from Italy 🇮🇹", sender: 'me', time: '5:50 PM', read: true },
    { id: 3, text: "That's awesome! I've always wanted to visit. What was your favorite part?", sender: 'them', time: '5:55 PM', read: true },
    { id: 4, text: "Definitely the food and the architecture in Florence. Here's a photo I took there", sender: 'me', time: '6:00 PM', read: true, media: 'https://images.unsplash.com/photo-1543429257-3c30209b810d' },
  ],
};

// Message polling interval (in ms)
const MESSAGE_POLL_INTERVAL = 5000;

export default function ConversationScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();
  const params = useLocalSearchParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [showAttachments, setShowAttachments] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const chatId = params.id as string;
  const chatUser = CHAT_USERS[chatId] || null;
  const scrollViewRef = useRef<ScrollView>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Load messages
    loadMessages();
    
    // Set up polling for new messages
    startMessagePolling();
    
    return () => {
      // Clean up polling on unmount
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [chatId]);

  const startMessagePolling = () => {
    // Clear any existing interval
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
    
    // Set up new interval for polling
    pollIntervalRef.current = setInterval(() => {
      fetchNewMessages();
    }, MESSAGE_POLL_INTERVAL);
  };

  const fetchNewMessages = async () => {
    // In a real app, this would make an API call to fetch new messages
    // For now, we'll simulate by checking if there are any mock responses to add
    
    try {
      const storedMessages = await AsyncStorage.getItem(`messages_${chatId}`);
      if (storedMessages) {
        const currentMessages = JSON.parse(storedMessages) as Message[];
        
        // Check if we need to add any simulated responses
        // This is just for demo purposes - in a real app you'd fetch from an API
        const lastMessage = currentMessages[currentMessages.length - 1];
        
        if (lastMessage && lastMessage.sender === 'me' && !lastMessage.read) {
          // Mark message as read after a delay
          setTimeout(() => {
            markMessageAsRead(lastMessage.id);
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Error fetching new messages:', error);
    }
  };

  const markMessageAsRead = async (messageId: number) => {
    try {
      const storedMessages = await AsyncStorage.getItem(`messages_${chatId}`);
      if (storedMessages) {
        const currentMessages = JSON.parse(storedMessages) as Message[];
        const updatedMessages = currentMessages.map(msg => 
          msg.id === messageId ? { ...msg, read: true } : msg
        );
        
        await AsyncStorage.setItem(`messages_${chatId}`, JSON.stringify(updatedMessages));
        setMessages(updatedMessages);
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const loadMessages = async () => {
    try {
      const storedMessages = await AsyncStorage.getItem(`messages_${chatId}`);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      } else {
        // Initialize with default messages if none stored
        const defaultMessages = MESSAGES[chatId] || [];
        await AsyncStorage.setItem(`messages_${chatId}`, JSON.stringify(defaultMessages));
        setMessages(defaultMessages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    
    // Check authentication before sending
    if (!isAuthenticated) {
      Alert.alert(
        "Authentication Required", 
        "Please log in to send messages.",
        [{ text: "OK", onPress: () => router.push('/login') }]
      );
      return;
    }
    
    setIsSending(true);
    
    try {
      const newMessage: Message = {
        id: messages.length + 1,
        text: message,
        sender: 'me',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
        timestamp: Date.now(),
      };
      
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      setMessage('');
      setShowAttachments(false);

      // Save to local storage (in a real app, this would be an API call)
      await AsyncStorage.setItem(`messages_${chatId}`, JSON.stringify(updatedMessages));
      
      // Auto-scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
      
      // Simulate received message (for demo purposes)
      if (chatId === '1' && newMessage.text.toLowerCase().includes('weekend')) {
        setTimeout(() => {
          sendAutoReply("Great! Looking forward to our coffee date this weekend! 😊");
        }, 2000);
      } else if (messages.length % 3 === 0) {
        setTimeout(() => {
          sendAutoReply("That sounds interesting! Tell me more.");
        }, 2000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };
  
  const sendAutoReply = async (replyText: string) => {
    const replyMessage: Message = {
      id: messages.length + 2,
      text: replyText,
      sender: 'them',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true,
      timestamp: Date.now(),
    };
    
    const updatedMessages = [...messages, replyMessage];
    setMessages(updatedMessages);
    
    try {
      await AsyncStorage.setItem(`messages_${chatId}`, JSON.stringify(updatedMessages));
      
      // Auto-scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Error saving auto-reply:', error);
    }
  };

  const formatDate = (timestamp: string) => {
    // Check if the message was sent today and format accordingly
    const today = new Date().toLocaleDateString();
    const messageDate = new Date(timestamp).toLocaleDateString();
    
    if (today === messageDate) {
      return 'Today';
    } else {
      return messageDate;
    }
  };
  
  const renderMessageItem = (message: Message, index: number, allMessages: Message[]) => {
    const isFirstMessageOfDay = index === 0 || 
      formatDate(allMessages[index - 1].time) !== formatDate(message.time);
      
    return (
      <View key={message.id}>
        {isFirstMessageOfDay && (
          <View style={styles.dateHeader}>
            <Text style={styles.dateText}>{formatDate(message.time)}</Text>
          </View>
        )}
        
        <View 
          style={[
            styles.messageWrapper,
            message.sender === 'me' ? styles.myMessageWrapper : styles.theirMessageWrapper
          ]}
        >
          {message.sender === 'them' && chatUser && (
            <Image 
              source={{ uri: chatUser.image }} 
              style={styles.avatar}
            />
          )}
          
          <View 
            style={[
              styles.messageContent,
              message.sender === 'me' ? styles.myMessageContent : styles.theirMessageContent
            ]}
          >
            {message.media && (
              <Image 
                source={{ uri: message.media }} 
                style={styles.mediaImage}
                resizeMode="cover"
              />
            )}
            
            {message.text && (
              <Text style={styles.messageText}>{message.text}</Text>
            )}
            
            <View style={styles.messageFooter}>
              <Text style={styles.messageTime}>{message.time}</Text>
              {message.sender === 'me' && (
                <Text style={[
                  styles.readStatus, 
                  message.read ? styles.readStatusRead : {}
                ]}>
                  {message.read ? '✓✓' : '✓'}
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[
        styles.container, 
        { 
          paddingTop: insets.top,
          backgroundColor: theme.colors.background.primary 
        }
      ]}
    >
      <View style={[
        styles.header,
        { backgroundColor: theme.colors.background.secondary }
      ]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        
        {chatUser && (
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: chatUser.image }} 
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Text style={[
                styles.userName,
                { color: theme.colors.text.primary }
              ]}>{chatUser.name}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {chatUser.online && (
                  <View style={styles.onlineIndicator} />
                )}
                <Text style={[
                  styles.userStatus,
                  { color: theme.colors.text.secondary }
                ]}>
                  {chatUser.online ? 'Online' : chatUser.lastActive}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg, index) => renderMessageItem(msg, index, messages))}
      </ScrollView>

      {showAttachments && (
        <View style={styles.attachmentsPanel}>
          <View style={styles.attachmentOption}>
            <View style={[
              styles.attachmentIconContainer,
              { backgroundColor: '#FF6B6B' }
            ]}>
              <Camera size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.attachmentText}>Camera</Text>
          </View>
          
          <View style={styles.attachmentOption}>
            <View style={[
              styles.attachmentIconContainer,
              { backgroundColor: '#4ECDC4' }
            ]}>
              <ImageIcon size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.attachmentText}>Gallery</Text>
          </View>
          
          <View style={styles.attachmentOption}>
            <View style={[
              styles.attachmentIconContainer,
              { backgroundColor: '#FFD166' }
            ]}>
              <Mic size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.attachmentText}>Audio</Text>
          </View>
        </View>
      )}

      <View style={[styles.inputContainer, { paddingBottom: insets.bottom || 20 }]}>
        <TouchableOpacity 
          style={styles.attachButton}
          onPress={() => setShowAttachments(!showAttachments)}
        >
          <Paperclip size={20} color={theme.colors.text.secondary} />
        </TouchableOpacity>
        
        <TextInput
          style={styles.textInput}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          placeholderTextColor={theme.colors.text.secondary}
          multiline
          editable={!isSending}
        />
        
        {!message.trim() ? (
          <TouchableOpacity style={styles.emojiButton}>
            <Smile size={20} color={theme.colors.text.secondary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.sendButton, isSending && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={isSending}
          >
            {isSending ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Send size={20} color={theme.colors.text.primary} />
            )}
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2D2D2D',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  userStatus: {
    fontSize: 12,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#43D854',
    marginRight: 4,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  dateHeader: {
    alignItems: 'center',
    marginVertical: 12,
  },
  dateText: {
    fontSize: 12,
    color: '#9CA3AF',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '85%',
  },
  myMessageWrapper: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  theirMessageWrapper: {
    alignSelf: 'flex-start',
  },
  messageContent: {
    borderRadius: 16,
    padding: 12,
    position: 'relative',
  },
  myMessageContent: {
    backgroundColor: '#FF1493',
    borderBottomRightRadius: 0,
  },
  theirMessageContent: {
    backgroundColor: '#2A2A2A',
    borderBottomLeftRadius: 0,
  },
  messageText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  messageTime: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  readStatus: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.5)',
    marginLeft: 4,
  },
  readStatusRead: {
    color: '#43D854',
  },
  mediaImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#2D2D2D',
    backgroundColor: '#1F1F1F',
  },
  attachButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderRadius: 20,
    backgroundColor: '#2A2A2A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#FFFFFF',
  },
  emojiButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF1493',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#FF1493AA',
  },
  attachmentsPanel: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#2D2D2D',
    backgroundColor: '#1F1F1F',
  },
  attachmentOption: {
    alignItems: 'center',
    width: 80,
  },
  attachmentIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  attachmentText: {
    fontSize: 12,
    color: '#AAAAAA',
  },
  headerProfile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 12,
  },
  attachmentsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#1F1F1F',
    borderTopWidth: 1,
    borderTopColor: '#2D2D2D',
  },
  attachmentButton: {
    alignItems: 'center',
  },
  attachmentIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333333',
    padding: 0,
  },
}); 