import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Moment {
  id: string;
  userId: string;
  userName: string;
  userImage: string;
  image: string;
  caption?: string;
  timestamp: string;
  createdAt: number;
  expiresAt: number;
  likes: number;
  hasLiked?: boolean;
}

interface MomentsContextType {
  moments: Moment[];
  userMoments: Moment[];
  loading: boolean;
  createMoment: (caption: string, imageUri: string) => Promise<void>;
  likeMoment: (momentId: string) => Promise<void>;
  replyToMoment: (momentId: string, message: string) => Promise<void>;
}

const MomentsContext = createContext<MomentsContextType | undefined>(undefined);

// Mock user data
const CURRENT_USER = {
  id: 'current-user',
  name: 'Alexander',
  image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
};

// Mock moments data
const INITIAL_MOMENTS: Moment[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'Emma',
    userImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    caption: 'Beautiful sunset at the beach today! 🌅',
    timestamp: '2 hours ago',
    createdAt: Date.now() - 7200000, // 2 hours ago
    expiresAt: Date.now() + 79200000, // 22 hours from now
    likes: 12,
    hasLiked: false,
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Oliver',
    userImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9',
    caption: 'Just finished a photoshoot in the city 📸',
    timestamp: '5 hours ago',
    createdAt: Date.now() - 18000000, // 5 hours ago
    expiresAt: Date.now() + 68400000, // 19 hours from now
    likes: 24,
    hasLiked: true,
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Sophie',
    userImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    image: 'https://images.unsplash.com/photo-1523264939339-c89f9dadde2e',
    caption: 'Morning yoga session 🧘‍♀️',
    timestamp: '8 hours ago',
    createdAt: Date.now() - 28800000, // 8 hours ago
    expiresAt: Date.now() + 57600000, // 16 hours from now
    likes: 18,
    hasLiked: false,
  },
];

interface MomentsProviderProps {
  children: ReactNode;
}

export const MomentsProvider = ({ children }: MomentsProviderProps) => {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter moments that belong to the current user
  const userMoments = moments.filter(moment => moment.userId === CURRENT_USER.id);
  
  // Load moments from storage on mount
  useEffect(() => {
    const loadMoments = async () => {
      try {
        const storedMoments = await AsyncStorage.getItem('moments');
        if (storedMoments) {
          const parsedMoments = JSON.parse(storedMoments) as Moment[];
          
          // Filter out expired moments
          const validMoments = parsedMoments.filter(
            moment => moment.expiresAt > Date.now()
          );
          
          setMoments(validMoments);
        } else {
          // Initialize with mock data if no stored moments
          setMoments(INITIAL_MOMENTS);
          await AsyncStorage.setItem('moments', JSON.stringify(INITIAL_MOMENTS));
        }
      } catch (error) {
        console.error('Error loading moments:', error);
        setMoments(INITIAL_MOMENTS);
      } finally {
        setLoading(false);
      }
    };
    
    loadMoments();
    
    // Set up interval to check for expired moments
    const interval = setInterval(() => {
      setMoments(prevMoments => 
        prevMoments.filter(moment => moment.expiresAt > Date.now())
      );
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);
  
  // Save moments to storage whenever they change
  useEffect(() => {
    const saveMoments = async () => {
      try {
        await AsyncStorage.setItem('moments', JSON.stringify(moments));
      } catch (error) {
        console.error('Error saving moments:', error);
      }
    };
    
    if (!loading) {
      saveMoments();
    }
  }, [moments, loading]);
  
  // Create a new moment
  const createMoment = async (caption: string, imageUri: string) => {
    const now = Date.now();
    const newMoment: Moment = {
      id: `moment-${now}`,
      userId: CURRENT_USER.id,
      userName: CURRENT_USER.name,
      userImage: CURRENT_USER.image,
      image: imageUri,
      caption: caption.trim() || undefined,
      timestamp: 'Just now',
      createdAt: now,
      expiresAt: now + 86400000, // 24 hours from now
      likes: 0,
      hasLiked: false,
    };
    
    setMoments(prevMoments => [newMoment, ...prevMoments]);
  };
  
  // Like/unlike a moment
  const likeMoment = async (momentId: string) => {
    setMoments(prevMoments => 
      prevMoments.map(moment => {
        if (moment.id === momentId) {
          const hasLiked = !moment.hasLiked;
          return {
            ...moment,
            hasLiked,
            likes: hasLiked ? moment.likes + 1 : moment.likes - 1,
          };
        }
        return moment;
      })
    );
  };
  
  // Reply to a moment (in a real app, this would create a message)
  const replyToMoment = async (momentId: string, message: string) => {
    // In a real app, this would send a message to the user
    console.log(`Replying to moment ${momentId} with message: ${message}`);
    
    // For demo purposes, we'll just return a resolved promise
    return Promise.resolve();
  };
  
  return (
    <MomentsContext.Provider 
      value={{ 
        moments, 
        userMoments,
        loading, 
        createMoment, 
        likeMoment, 
        replyToMoment 
      }}
    >
      {children}
    </MomentsContext.Provider>
  );
};

export const useMoments = () => {
  const context = useContext(MomentsContext);
  if (context === undefined) {
    throw new Error('useMoments must be used within a MomentsProvider');
  }
  return context;
};
