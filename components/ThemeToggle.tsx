import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Switch } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Moon, Sun } from 'lucide-react-native';

interface ThemeToggleProps {
  style?: any;
}

export const ThemeToggle = ({ style }: ThemeToggleProps) => {
  const { isDark, toggleTheme, setThemeMode, themeMode } = useTheme();
  
  return (
    <View style={[styles.container, style]}>
      <View style={styles.toggleRow}>
        <View style={styles.iconLabelContainer}>
          {isDark ? (
            <Moon size={22} color="#FFFFFF" style={styles.icon} />
          ) : (
            <Sun size={22} color="#333333" style={styles.icon} />
          )}
          <Text style={[styles.text, isDark && styles.darkText]}>
            {isDark ? 'Dark Mode' : 'Light Mode'}
          </Text>
        </View>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: '#DDDDDD', true: '#555555' }}
          thumbColor={isDark ? '#FF1493' : '#FFFFFF'}
          ios_backgroundColor="#DDDDDD"
        />
      </View>
      
      <View style={styles.radioContainer}>
        <TouchableOpacity 
          style={[styles.radioOption, themeMode === 'light' && styles.radioSelected]}
          onPress={() => setThemeMode('light')}
        >
          <View style={styles.radioButton}>
            {themeMode === 'light' && <View style={styles.radioButtonInner} />}
          </View>
          <Text style={[styles.radioText, isDark && styles.darkText]}>Light</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.radioOption, themeMode === 'dark' && styles.radioSelected]}
          onPress={() => setThemeMode('dark')}
        >
          <View style={styles.radioButton}>
            {themeMode === 'dark' && <View style={styles.radioButtonInner} />}
          </View>
          <Text style={[styles.radioText, isDark && styles.darkText]}>Dark</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.radioOption, themeMode === 'system' && styles.radioSelected]}
          onPress={() => setThemeMode('system')}
        >
          <View style={styles.radioButton}>
            {themeMode === 'system' && <View style={styles.radioButtonInner} />}
          </View>
          <Text style={[styles.radioText, isDark && styles.darkText]}>System</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  iconLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  darkText: {
    color: '#FFFFFF',
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  radioSelected: {
    backgroundColor: 'rgba(255, 20, 147, 0.1)',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FF1493',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF1493',
  },
  radioText: {
    fontSize: 14,
    color: '#333333',
  },
}); 