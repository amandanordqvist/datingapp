import { StyleSheet, View, Text, ScrollView, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
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

const MATCHES = [
  {
    id: '1',
    name: 'Emma',
    age: 26,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    matchPercentage: 95,
  },
  {
    id: '2',
    name: 'Oliver',
    age: 29,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    matchPercentage: 88,
  },
  {
    id: '3',
    name: 'Sophie',
    age: 27,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    matchPercentage: 85,
  },
];

export default function MatchesScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.headerTitle}>Your Matches</Text>
        <Text style={styles.headerSubtitle}>
          People who share your interests
        </Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {MATCHES.map((match) => (
          <Link
            asChild
            href={{
              pathname: '/discover/profile-details',
              params: { id: match.id }
            }}
            key={match.id} 
          >
            <TouchableOpacity style={styles.matchCard}>
              <Image source={{ uri: match.image }} style={styles.matchImage} />
              <View style={styles.matchInfo}>
                <Text style={styles.matchName}>
                  {match.name}, {match.age}
                </Text>
                <Text style={styles.matchPercentage}>
                  {match.matchPercentage}% Match
                </Text>
              </View>
            </TouchableOpacity>
          </Link>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background.dark,
  },
  header: {
    backgroundColor: THEME.background.card,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2D2D2D',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  matchCard: {
    flexDirection: 'row',
    backgroundColor: THEME.background.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#2D2D2D',
  },
  matchImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: THEME.primary,
  },
  matchInfo: {
    marginLeft: 16,
  },
  matchName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: THEME.text.primary,
  },
  matchPercentage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: THEME.primary,
    marginTop: 2,
  },
});