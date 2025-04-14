import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Send } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Message {
  id: number;
  text: string;
  sender: 'me' | 'them';
  time: string;
}

interface MessagesData {
  [key: string]: Message[];
}

const THEME = {
  primary: '#FF1493',
  background: {
    dark: '#171717',
    card: '#1F1F1F',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#9CA3AF',
  }
};

const MESSAGES: MessagesData = {
  '1': [
    { id: 1, text: "Hey! I saw we matched 😊", sender: 'them', time: '10:30 AM' },
    { id: 2, text: "Hi! Yes, I love your profile! Especially the coffee enthusiasm 😄", sender: 'me', time: '10:32 AM' },
    { id: 3, text: "Thanks! I know this amazing coffee place downtown. Would you like to grab a cup sometime?", sender: 'them', time: '10:35 AM' },
  ],
  '2': [
    { id: 1, text: "Hi there! I noticed you're into photography too!", sender: 'them', time: '2:15 PM' },
    { id: 2, text: "Yes! I love capturing moments. What's your favorite subject to shoot?", sender: 'me', time: '2:20 PM' },
  ],
  '3': [
    { id: 1, text: "Hello! Your travel photos are amazing!", sender: 'them', time: '5:45 PM' },
    { id: 2, text: "Thank you! I just got back from Italy 🇮🇹", sender: 'me', time: '5:50 PM' },
  ],
};

export default function ConversationScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const chatId = params.id as string;

  useEffect(() => {
    loadMessages();
  }, [chatId]);

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
    
    const newMessage: Message = {
      id: messages.length + 1,
      text: message,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setMessage('');

    try {
      await AsyncStorage.setItem(`messages_${chatId}`, JSON.stringify(updatedMessages));
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}>
          <ArrowLeft size={24} color={THEME.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat</Text>
      </View>

      <ScrollView 
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesList}
      >
        {messages.map((msg) => (
          <View 
            key={msg.id} 
            style={[
              styles.messageWrapper,
              msg.sender === 'me' ? styles.myMessageWrapper : styles.theirMessageWrapper
            ]}
          >
            <View 
              style={[
                styles.message,
                msg.sender === 'me' ? styles.myMessage : styles.theirMessage
              ]}
            >
              <Text style={styles.messageText}>{msg.text}</Text>
              <Text style={styles.messageTime}>{msg.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={[styles.inputContainer, { paddingBottom: insets.bottom || 20 }]}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          placeholderTextColor={THEME.text.secondary}
          multiline
        />
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={sendMessage}
        >
          <Send size={20} color={THEME.text.primary} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background.dark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: THEME.background.card,
    borderBottomWidth: 1,
    borderBottomColor: '#2D2D2D',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: THEME.text.primary,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesList: {
    padding: 16,
    gap: 16,
  },
  messageWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    maxWidth: '80%',
  },
  myMessageWrapper: {
    alignSelf: 'flex-end',
  },
  theirMessageWrapper: {
    alignSelf: 'flex-start',
  },
  message: {
    padding: 12,
    borderRadius: 16,
    backgroundColor: THEME.background.card,
  },
  myMessage: {
    backgroundColor: THEME.primary,
  },
  theirMessage: {
    backgroundColor: THEME.background.card,
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: THEME.text.primary,
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: THEME.text.secondary,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    backgroundColor: THEME.background.card,
    borderTopWidth: 1,
    borderTopColor: '#2D2D2D',
    gap: 12,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: THEME.background.dark,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: THEME.text.primary,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 