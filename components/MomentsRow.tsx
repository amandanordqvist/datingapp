import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Plus } from 'lucide-react-native';
import MomentStory from './MomentStory';
import MomentViewer from './MomentViewer';
import CreateMoment from './CreateMoment';
import { useMoments, Moment } from '@/hooks/useMoments';
import * as Haptics from 'expo-haptics';

interface MomentsRowProps {
  style?: any;
}

export default function MomentsRow({ style }: MomentsRowProps) {
  const { theme } = useTheme();
  const { moments, userMoments, loading, createMoment, likeMoment, replyToMoment } = useMoments();
  
  const [viewerVisible, setViewerVisible] = useState(false);
  const [createVisible, setCreateVisible] = useState(false);
  const [selectedMomentIndex, setSelectedMomentIndex] = useState(0);
  
  const handleOpenMoment = (index: number) => {
    setSelectedMomentIndex(index);
    setViewerVisible(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  const handleCreateMoment = () => {
    setCreateVisible(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  const handleSubmitMoment = async (caption: string, imageUri: string) => {
    await createMoment(caption, imageUri);
  };
  
  if (loading) {
    return (
      <View style={[styles.loadingContainer, style]}>
        <ActivityIndicator color={theme.colors.primary} size="small" />
      </View>
    );
  }
  
  // If there are no moments and the user hasn't created any, don't show the row
  if (moments.length === 0 && userMoments.length === 0) {
    return null;
  }
  
  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          Moments
        </Text>
        <TouchableOpacity 
          style={[
            styles.seeAllButton,
            { borderColor: theme.colors.primary }
          ]}
        >
          <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>
            See All
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Create Moment Button */}
        <TouchableOpacity 
          style={[
            styles.createButton,
            { backgroundColor: theme.colors.background.tertiary }
          ]}
          onPress={handleCreateMoment}
        >
          <View style={[
            styles.createIconContainer,
            { backgroundColor: theme.colors.primary }
          ]}>
            <Plus size={24} color="#FFFFFF" />
          </View>
          <Text style={[
            styles.createText,
            { color: theme.colors.text.primary }
          ]}>
            Create
          </Text>
        </TouchableOpacity>
        
        {/* User's Moments */}
        {userMoments.map((moment, index) => (
          <MomentStory
            key={`user-${moment.id}`}
            image={moment.image}
            name="Your Story"
            isNew={false}
            isViewed={false}
            onPress={() => handleOpenMoment(moments.findIndex(m => m.id === moment.id))}
          />
        ))}
        
        {/* Other Users' Moments */}
        {moments
          .filter(moment => moment.userId !== 'current-user')
          .map((moment, index) => (
            <MomentStory
              key={moment.id}
              image={moment.userImage}
              name={moment.userName}
              isNew={moment.createdAt > Date.now() - 3600000} // New if less than 1 hour old
              isViewed={false} // In a real app, this would track viewed status
              onPress={() => handleOpenMoment(moments.findIndex(m => m.id === moment.id))}
            />
          ))}
      </ScrollView>
      
      {/* Moment Viewer Modal */}
      <MomentViewer
        visible={viewerVisible}
        stories={moments}
        initialStoryIndex={selectedMomentIndex}
        onClose={() => setViewerVisible(false)}
        onLike={likeMoment}
        onReply={replyToMoment}
      />
      
      {/* Create Moment Modal */}
      <CreateMoment
        visible={createVisible}
        onClose={() => setCreateVisible(false)}
        onSubmit={handleSubmitMoment}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  loadingContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  seeAllButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '500',
  },
  scrollContent: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  createButton: {
    alignItems: 'center',
    marginRight: 12,
    width: 70,
  },
  createIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  createText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
