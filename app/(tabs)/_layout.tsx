import { Tabs } from 'expo-router';
import { Heart, Chrome as Home, User, MessageCircle } from 'lucide-react-native';

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

const TabBarStyle = {
  backgroundColor: THEME.background.dark,
  borderTopWidth: 0,
  elevation: 0,
  shadowOpacity: 0,
  height: 60,
  borderTopColor: '#2D2D2D',
  paddingBottom: 8,
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: TabBarStyle,
        tabBarActiveTintColor: THEME.primary,
        tabBarInactiveTintColor: THEME.text.secondary,
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginBottom: -4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: 'Matches',
          tabBarIcon: ({ color, size }) => <Heart size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, size }) => <MessageCircle size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}