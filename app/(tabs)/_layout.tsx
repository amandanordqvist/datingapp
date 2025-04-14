import React from 'react';
import { Tabs } from 'expo-router';
import { Heart, User, MessageCircle } from 'lucide-react-native';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBar, 
          { 
            paddingBottom: Platform.OS === 'ios' ? insets.bottom : 12,
            backgroundColor: theme.colors.background.secondary,
            borderTopColor: theme.colors.border,
            shadowColor: isDark ? '#000' : '#bbb',
          }
        ],
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text.secondary,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIconStyle: styles.tabBarIcon,
        // Hide tab bar on specific screens if needed
        tabBarHideOnKeyboard: true,
      }}
      // Make sure there are no hidden tabs
      initialRouteName="index"
    >
      {/* Main swiping screen */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.tabIconContainer}>
              <Feather name="compass" size={size} color={color} />
            </View>
          ),
        }}
      />
      
      {/* Matches screen showing people who liked you */}
      <Tabs.Screen
        name="matches"
        options={{
          title: 'Matches',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.tabIconContainer}>
              <Heart size={size} color={color} />
            </View>
          ),
        }}
      />
      
      {/* Messages screen for conversations */}
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.tabIconContainer}>
              <MessageCircle size={size} color={color} />
            </View>
          ),
        }}
      />
      
      {/* User profile screen */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.tabIconContainer}>
              <User size={size} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 0,
    elevation: 10,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    height: Platform.OS === 'ios' ? 90 : 70,
    paddingTop: 12,
  },
  tabBarLabel: {
    fontWeight: '500',
    fontSize: 12,
    marginTop: 4,
  },
  tabBarIcon: {
    marginBottom: -4,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});