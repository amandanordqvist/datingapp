import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, Filter, Bell, Heart } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface Match {
  id: string;
  name: string;
  age: number;
  image: string;
  lastActive: string;
  compatibility: number;
  isNew?: boolean;
}

const MATCHES: Match[] = [
  {
    id: '1',
    name: 'Emma',
    age: 24,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    lastActive: 'Online',
    compatibility: 95,
    isNew: true,
  },
  {
    id: '2',
    name: 'Oliver',
    age: 27,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    lastActive: '1h ago',
    compatibility: 88,
  },
  {
    id: '3',
    name: 'Sophie',
    age: 25,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    lastActive: 'Online',
    compatibility: 92,
    isNew: true,
  },
  {
    id: '4',
    name: 'Alexander',
    age: 29,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    lastActive: '3h ago',
    compatibility: 85,
  },
  {
    id: '5',
    name: 'Jessica',
    age: 26,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
    lastActive: '2h ago',
    compatibility: 90,
  },
];

export default function MatchesScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const [matches, setMatches] = useState<Match[]>(MATCHES);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredMatches = searchQuery.trim() 
    ? matches.filter(match => 
        match.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : matches;
  
  const renderHeader = () => {
    return (
      <View style={[
        styles.header, 
        { 
          backgroundColor: theme.colors.background.secondary,
          paddingTop: insets.top + 16,
          paddingBottom: 16,
          paddingHorizontal: 16
        }
      ]}>
        <View style={styles.headerTop}>
          <View style={styles.headerTitleContainer}>
            <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>Matches</Text>
            <Text style={[styles.headerSubtitle, { color: theme.colors.text.secondary }]}>
              {matches.length} total
            </Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={[styles.headerButton, { backgroundColor: 'rgba(255, 20, 147, 0.1)' }]}
              onPress={() => setShowSearch(!showSearch)}
            >
              <Ionicons name="search" size={22} color={theme.colors.text.secondary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.headerButton, { backgroundColor: 'rgba(255, 20, 147, 0.1)' }]}
            >
              <Ionicons name="options-outline" size={22} color={theme.colors.text.secondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={22} color={theme.colors.text.secondary} />
              <View style={[styles.notificationBadge, { backgroundColor: '#FF1493' }]} />
            </TouchableOpacity>
          </View>
        </View>

        {showSearch && (
          <View style={styles.searchContainer}>
            <View style={[styles.searchInputContainer, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}>
              <Ionicons 
                name="search" 
                size={20} 
                color={theme.colors.text.secondary} 
                style={styles.searchIcon} 
              />
              <TextInput
                style={[styles.searchInput, { color: theme.colors.text.primary }]}
                placeholder="Search matches..."
                placeholderTextColor={theme.colors.text.secondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>
        )}
      </View>
    );
  };
  
  const renderMatchItem = ({ item }: { item: Match }) => {
    // Calculate the width of each item (2 per row with spacing)
    const itemWidth = (SCREEN_WIDTH - (16 * 3)) / 2;
    
    return (
      <View style={[
        styles.matchItem, 
        { 
          backgroundColor: theme.colors.background.secondary,
          width: itemWidth,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3
        }
      ]}>
        <View style={styles.matchImageContainer}>
          <Image source={{ uri: item.image }} style={styles.matchImage} />
          {item.isNew && (
            <View style={[styles.newBadge, { backgroundColor: '#FF1493' }]}>
              <Text style={styles.newBadgeText}>NEW</Text>
            </View>
          )}
        </View>
        <View style={styles.matchContent}>
          <View style={styles.matchNameContainer}>
            <Text style={[styles.matchName, { color: theme.colors.text.primary }]}>
              {item.name}, {item.age}
            </Text>
          </View>
          <Text style={[styles.matchStatus, { color: theme.colors.text.secondary }]}>
            {item.lastActive}
          </Text>
          <View style={styles.compatibilityContainer}>
            <Text style={[styles.compatibilityText, { color: theme.colors.text.secondary }]}>
              {item.compatibility}% Compatible
            </Text>
            <View style={styles.compatibilityBar}>
              <View 
                style={[
                  styles.compatibilityFill, 
                  { 
                    backgroundColor: '#FF1493',
                    width: `${item.compatibility}%` 
                  }
                ]} 
              />
            </View>
          </View>
        </View>
      </View>
    );
  };
  
  const renderEmptyState = () => {
    return (
      <View style={styles.emptyContainer}>
        <View style={[
          styles.emptyStateIcon, 
          { backgroundColor: 'rgba(255, 20, 147, 0.1)' }
        ]}>
          <Feather name="user" size={50} color={theme.colors.text.secondary} />
        </View>
        <Text style={[styles.emptyTitle, { color: theme.colors.text.primary }]}>
          No matches yet
        </Text>
        <Text style={[styles.emptySubtitle, { color: theme.colors.text.secondary }]}>
          Start swiping to find your perfect match!
        </Text>
      </View>
    );
  };
  
  return (
    <View style={[
      styles.container,
      { backgroundColor: theme.colors.background.primary }
    ]}>
      {renderHeader()}
      
      <FlatList
        data={filteredMatches}
        renderItem={renderMatchItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.matchesList}
        numColumns={2}
        columnWrapperStyle={styles.matchesRow}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
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
  },
  searchContainer: {
    marginTop: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 46,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  matchesList: {
    padding: 16,
  },
  matchesRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  matchItem: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  matchImageContainer: {
    position: 'relative',
  },
  matchImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  newBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  matchContent: {
    padding: 16,
  },
  matchNameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  matchName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  matchStatus: {
    fontSize: 12,
    marginLeft: 4,
  },
  compatibilityContainer: {
    marginTop: 4,
  },
  compatibilityText: {
    fontSize: 14,
    marginBottom: 4,
  },
  compatibilityBar: {
    height: 4,
    backgroundColor: '#2D2D2D',
    borderRadius: 2,
    overflow: 'hidden',
  },
  compatibilityFill: {
    height: '100%',
    borderRadius: 2,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginTop: 100,
  },
  emptyStateIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
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
  },
}); 