import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, MapPin, Calendar, User } from 'lucide-react-native';
import Slider from '@react-native-community/slider';
import { router } from 'expo-router';

export default function PreferencesScreen() {
  const insets = useSafeAreaInsets();
  
  // Preferences state
  const [minAge, setMinAge] = useState(21);
  const [maxAge, setMaxAge] = useState(35);
  const [distance, setDistance] = useState(25);
  const [showMen, setShowMen] = useState(true);
  const [showWomen, setShowWomen] = useState(true);
  const [showNonBinary, setShowNonBinary] = useState(true);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dating Preferences</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Calendar size={20} color="#FF1493" style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Age Range</Text>
          </View>
          
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabelText}>Minimum Age: {minAge}</Text>
            <Slider
              value={minAge}
              minimumValue={18}
              maximumValue={65}
              step={1}
              minimumTrackTintColor="#FF1493"
              maximumTrackTintColor="#DDDDDD"
              thumbTintColor="#FF1493"
              onValueChange={setMinAge}
              style={styles.slider}
            />
            
            <Text style={[styles.sliderLabelText, { marginTop: 16 }]}>Maximum Age: {maxAge}</Text>
            <Slider
              value={maxAge}
              minimumValue={18}
              maximumValue={65}
              step={1}
              minimumTrackTintColor="#FF1493"
              maximumTrackTintColor="#DDDDDD"
              thumbTintColor="#FF1493"
              onValueChange={setMaxAge}
              style={styles.slider}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MapPin size={20} color="#FF1493" style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Maximum Distance</Text>
          </View>
          
          <View style={styles.sliderContainer}>
            <Slider
              value={distance}
              minimumValue={1}
              maximumValue={100}
              step={1}
              minimumTrackTintColor="#FF1493"
              maximumTrackTintColor="#DDDDDD"
              thumbTintColor="#FF1493"
              onValueChange={setDistance}
              style={styles.slider}
            />
            <View style={styles.distanceLabel}>
              <Text style={styles.sliderLabel}>{distance} miles</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <User size={20} color="#FF1493" style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Show Me</Text>
          </View>
          
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Men</Text>
            <Switch
              value={showMen}
              onValueChange={setShowMen}
              trackColor={{ false: '#DDDDDD', true: '#FF1493' }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#DDDDDD"
            />
          </View>
          
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Women</Text>
            <Switch
              value={showWomen}
              onValueChange={setShowWomen}
              trackColor={{ false: '#DDDDDD', true: '#FF1493' }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#DDDDDD"
            />
          </View>
          
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Non-binary</Text>
            <Switch
              value={showNonBinary}
              onValueChange={setShowNonBinary}
              trackColor={{ false: '#DDDDDD', true: '#FF1493' }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#DDDDDD"
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Additional Filters</Text>
          </View>
          
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Verified Profiles Only</Text>
            <Switch
              value={showVerifiedOnly}
              onValueChange={setShowVerifiedOnly}
              trackColor={{ false: '#DDDDDD', true: '#FF1493' }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#DDDDDD"
            />
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.applyButton}
          onPress={() => router.back()}
        >
          <Text style={styles.applyButtonText}>Apply Filters</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.resetButton}
          onPress={() => {
            setMinAge(21);
            setMaxAge(35);
            setDistance(25);
            setShowMen(true);
            setShowWomen(true);
            setShowNonBinary(true);
            setShowVerifiedOnly(false);
          }}
        >
          <Text style={styles.resetButtonText}>Reset to Default</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE'
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  sliderContainer: {
    marginTop: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabelText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444444',
    marginBottom: 8,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  distanceLabel: {
    alignItems: 'center',
    marginTop: 8,
  },
  sliderLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444444',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 14,
    color: '#444444',
  },
  applyButton: {
    backgroundColor: '#FF1493',
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  resetButton: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 32,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF1493',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF1493',
  },
}); 