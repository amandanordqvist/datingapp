import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Settings, Heart, Bell, Shield, LogOut, Camera, Award, Gift, Moon, Sun } from 'lucide-react-native';
import { router, Route } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { ThemeToggle } from '@/components/ThemeToggle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/app/_layout';

interface MenuItem {
  icon: any;
  title: string;
  subtitle: string;
  route?: Route;
}

const MENU_ITEMS: MenuItem[] = [
  {
    icon: Settings,
    title: 'Settings',
    subtitle: 'Account preferences and privacy',
    route: '/settings' as Route
  },
  {
    icon: Heart,
    title: 'Dating Preferences',
    subtitle: 'Match settings and filters',
    route: '/profile/preferences' as Route
  },
  {
    icon: Bell,
    title: 'Notifications',
    subtitle: 'Message and match alerts',
    route: '/notifications' as Route
  },
  {
    icon: Shield,
    title: 'Privacy & Security',
    subtitle: 'Control your data and visibility',
    route: '/privacy' as Route
  },
  {
    icon: Award,
    title: 'Premium Features',
    subtitle: 'Boost your profile visibility',
    route: '/premium' as Route
  },
  {
    icon: Gift,
    title: 'Invite Friends',
    subtitle: 'Share with friends, get rewards',
    route: '/invite' as Route
  }
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const { setIsAuthenticated } = useAuth();

  const navigateToEditProfile = () => {
    router.push('/profile/edit' as Route);
  };

  const navigateToRoute = (route: Route | undefined) => {
    if (route) {
      router.push(route);
    }
  };
  
  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear the auth token
              await AsyncStorage.removeItem('user_token');
              
              // Update auth context
              setIsAuthenticated(false);
              
              // Navigate to login screen
              router.push('/login');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to log out. Please try again.');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={[
      styles.container, 
      { 
        paddingTop: insets.top,
        backgroundColor: theme.colors.background.primary
      }
    ]}>
      <ScrollView style={styles.scrollView}>
        <View style={[
          styles.header,
          { backgroundColor: theme.colors.background.secondary }
        ]}>
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
              }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.cameraButton} onPress={navigateToEditProfile}>
              <Camera size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={[
            styles.name,
            { color: theme.colors.text.primary }
          ]}>Alexander, 28</Text>
          <TouchableOpacity style={styles.editButton} onPress={navigateToEditProfile}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={[
          styles.stats,
          { backgroundColor: theme.colors.background.secondary }
        ]}>
          <View style={styles.statItem}>
            <Text style={[
              styles.statNumber,
              { color: theme.colors.text.primary }
            ]}>85%</Text>
            <Text style={[
              styles.statLabel,
              { color: theme.colors.text.secondary }
            ]}>Profile Complete</Text>
          </View>
          <View style={[
            styles.statDivider,
            { backgroundColor: theme.colors.border }
          ]} />
          <View style={styles.statItem}>
            <Text style={[
              styles.statNumber,
              { color: theme.colors.text.primary }
            ]}>24</Text>
            <Text style={[
              styles.statLabel,
              { color: theme.colors.text.secondary }
            ]}>Matches</Text>
          </View>
          <View style={[
            styles.statDivider,
            { backgroundColor: theme.colors.border }
          ]} />
          <View style={styles.statItem}>
            <Text style={[
              styles.statNumber,
              { color: theme.colors.text.primary }
            ]}>12</Text>
            <Text style={[
              styles.statLabel,
              { color: theme.colors.text.secondary }
            ]}>Active Chats</Text>
          </View>
        </View>

        <View style={[
          styles.section,
          { backgroundColor: theme.colors.background.secondary }
        ]}>
          <Text style={[
            styles.sectionTitle,
            { color: theme.colors.text.primary }
          ]}>Appearance</Text>
          <ThemeToggle style={styles.themeToggle} />
        </View>

        <View style={[
          styles.menu,
          { backgroundColor: theme.colors.background.secondary }
        ]}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.menuItem}
              onPress={() => navigateToRoute(item.route)}
            >
              <View style={[
                styles.menuIcon,
                { backgroundColor: theme.colors.background.highlight }
              ]}>
                <item.icon size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.menuText}>
                <Text style={[
                  styles.menuTitle,
                  { color: theme.colors.text.primary }
                ]}>{item.title}</Text>
                <Text style={[
                  styles.menuSubtitle,
                  { color: theme.colors.text.secondary }
                ]}>{item.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={[
          styles.logoutButton,
          { backgroundColor: theme.colors.background.highlight }
        ]} onPress={handleLogout}>
          <LogOut size={20} color={theme.colors.primary} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  section: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  themeToggle: {
    marginTop: 8,
  },
  imageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#FF1493',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 20,
    right: 0,
    backgroundColor: '#FF1493',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  editButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#FF1493',
    borderRadius: 20,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  stats: {
    flexDirection: 'row',
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    marginHorizontal: 16,
  },
  menu: {
    marginTop: 20,
    borderRadius: 16,
    marginHorizontal: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 4,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    marginLeft: 16,
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 40,
    padding: 16,
    marginHorizontal: 20,
    borderRadius: 16,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#FF1493',
  },
}); 