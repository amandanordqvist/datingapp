import { StyleSheet, View, Text, ScrollView, Image, FlatList, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Search, Filter, Bell } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  image: string;
  unread?: number;
  online?: boolean;
}

const CHATS: Chat[] = [
  {
    id: '1',
    name: 'Emma',
    lastMessage: 'Would love to meet for coffee! ☕️',
    time: '5m ago',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    unread: 2,
    online: true,
  },
  {
    id: '2',
    name: 'Oliver',
    lastMessage: 'That sounds great! When are you free?',
    time: '2h ago',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    unread: 0,
    online: false,
  },
  {
    id: '3',
    name: 'Sophie',
    lastMessage: 'Looking forward to our date tomorrow!',
    time: '1d ago',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    unread: 0,
    online: true,
  },
  {
    id: '4',
    name: 'Alexander',
    lastMessage: 'I loved that restaurant you recommended!',
    time: '2d ago',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    unread: 0,
    online: false,
  },
  {
    id: '5',
    name: 'Jessica',
    lastMessage: 'Just sent you the photo from our hike 🏔️',
    time: '3d ago',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
    unread: 1,
    online: true,
  },
];

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const [chats, setChats] = useState<Chat[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  useEffect(() => {
    loadChats();
  }, []);
  
  const loadChats = async () => {
    try {
      const storedChats = await AsyncStorage.getItem('chats');
      if (storedChats) {
        setChats(JSON.parse(storedChats));
      } else {
        setChats(CHATS);
        await AsyncStorage.setItem('chats', JSON.stringify(CHATS));
      }
    } catch (error) {
      console.error('Error loading chats:', error);
      setChats(CHATS);
    }
  };
  
  const markChatAsRead = async (chatId: string) => {
    const updatedChats = chats.map(chat => 
      chat.id === chatId ? { ...chat, unread: 0 } : chat
    );
    
    setChats(updatedChats);
    
    try {
      await AsyncStorage.setItem('chats', JSON.stringify(updatedChats));
    } catch (error) {
      console.error('Error updating chat status:', error);
    }
  };
  
  const navigateToChat = (chatId: string) => {
    markChatAsRead(chatId);
    router.push({
      pathname: '/messages/conversation',
      params: { id: chatId }
    });
  };
  
  const filteredChats = searchQuery.trim() 
    ? chats.filter(chat => 
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : chats;
    
  const renderChatItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity 
      key={item.id} 
      style={styles.chatItem}
      onPress={() => navigateToChat(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.image }} style={styles.avatar} />
        {item.online && <View style={styles.onlineIndicator} />}
      </View>
      
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <View style={styles.messageContainer}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {(item.unread ?? 0) > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
  
  const renderHeader = () => (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      <View style={styles.headerTop}>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>Messages</Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.text.secondary }]}>
            Connect with your matches
          </Text>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setShowSearch(!showSearch)}
          >
            <Search size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.headerButton}>
            <Filter size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={24} color={theme.colors.text.primary} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>
      </View>
      
      {showSearch && (
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color={theme.colors.text.secondary} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: theme.colors.text.primary }]}
              placeholder="Search conversations..."
              placeholderTextColor={theme.colors.text.secondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
          </View>
        </View>
      )}
    </View>
  );
  
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyTitle, { color: theme.colors.text.primary }]}>No messages yet</Text>
      <Text style={[styles.emptySubtitle, { color: theme.colors.text.secondary }]}>
        Start connecting with your matches to begin messaging
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      {renderHeader()}
      
      <FlatList
        data={filteredChats}
        renderItem={renderChatItem}
        keyExtractor={item => item.id}
        style={styles.content}
        contentContainerStyle={filteredChats.length === 0 ? { flex: 1 } : styles.scrollContent}
        ListEmptyComponent={renderEmptyList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#1F1F1F',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2D2D2D',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF1493',
    borderWidth: 2,
    borderColor: '#1F1F1F',
  },
  searchContainer: {
    marginTop: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    paddingHorizontal: 16,
    borderRadius: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#1F1F1F',
  },
  chatInfo: {
    flex: 1,
    marginLeft: 16,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  time: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    flex: 1,
    fontSize: 16,
    color: '#9CA3AF',
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: '#FF1493',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  unreadCount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
}); 