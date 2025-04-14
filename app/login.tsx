import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/hooks/useTheme';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { useAuth } from './_layout';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { setIsAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    // Simple validation
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      // In a real app, this would call an authentication API
      // For demo purposes, just simulate a delay and successful login
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock authentication - in a real app, this would verify credentials with a server
      // Always login successfully for the demo
      const mockUserToken = 'mock_token_' + Math.random().toString(36).substring(2);
      await AsyncStorage.setItem('user_token', mockUserToken);
      
      // Update auth context
      setIsAuthenticated(true);
      
      // Navigate to the main app after successful login
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Failed to log in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          backgroundColor: theme.colors.background.primary
        }
      ]}
    >
      <View style={styles.logoContainer}>
        <Image
          source={require('@/assets/images/icon.png')}
          style={styles.logo}
          // Fallback to a colored view if the image isn't available
          onError={() => {}}
        />
        <Text style={[styles.appName, { color: theme.colors.text.primary }]}>
          Dating App
        </Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          Welcome Back
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
          Sign in to continue
        </Text>

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        <View style={styles.inputGroup}>
          <View style={[
            styles.inputContainer,
            { backgroundColor: theme.colors.background.secondary }
          ]}>
            <Mail size={20} color={theme.colors.text.secondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: theme.colors.text.primary }]}
              placeholder="Email"
              placeholderTextColor={theme.colors.text.secondary}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={[
            styles.inputContainer,
            { backgroundColor: theme.colors.background.secondary }
          ]}>
            <Lock size={20} color={theme.colors.text.secondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: theme.colors.text.primary }]}
              placeholder="Password"
              placeholderTextColor={theme.colors.text.secondary}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
              {showPassword ? (
                <EyeOff size={20} color={theme.colors.text.secondary} />
              ) : (
                <Eye size={20} color={theme.colors.text.secondary} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={[styles.forgotPasswordText, { color: theme.colors.primary }]}>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.loginButton,
            isLoading && styles.loginButtonDisabled
          ]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.loginButtonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={[styles.signupText, { color: theme.colors.text.secondary }]}>
            Don't have an account?
          </Text>
          <TouchableOpacity>
            <Text style={[styles.signupLink, { color: theme.colors.primary }]}>
              {' Sign Up'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    backgroundColor: '#FF1493', // Fallback if image not found
    borderRadius: 20,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
  },
  formContainer: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
  },
  errorText: {
    color: '#FF6B6B',
    marginBottom: 20,
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  eyeIcon: {
    padding: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  forgotPasswordText: {
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#FF1493',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonDisabled: {
    backgroundColor: '#FF1493AA',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  signupText: {
    fontSize: 14,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: '600',
  },
}); 