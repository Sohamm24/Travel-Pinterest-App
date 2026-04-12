import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth, useUser } from '@clerk/clerk-expo';
import FeedScreen from '../screens/feed/FeedScreen';
import ImageUploadScreen from '../screens/upload/ImageUploadScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import CreatePostScreen from '../screens/post/CreatePostScreen';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import { spacing } from '../constants/spacing';
import { typography } from '../constants/typography';

export type RootStackParamList = {
  Login: undefined;
  Feed: undefined;
  ImageUpload: undefined;
  CreatePost: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator(): React.JSX.Element | null {
  const { colors } = useTheme();
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  if (!isLoaded) {
    return null; // Or a loading spinner
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.headerBg },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontWeight: typography.extrabold,
          fontSize: typography.xl,
          color: colors.textPrimary,
        },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      {!isSignedIn ? (
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
      ) : (
        <>
          <Stack.Screen
            name="Feed"
            component={FeedScreen}
            options={({ navigation }) => ({
              title: 'TravelPinterest',
              headerRight: () => (
                <View style={styles.headerRight}>
                  <ThemeToggle />
                  <TouchableOpacity
                    style={[styles.plusBtn, { backgroundColor: colors.primary }]}
                    onPress={() => navigation.navigate('CreatePost')}
                    accessibilityLabel="Create Post"
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text style={styles.plusIcon}>+</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.profileBtn, { backgroundColor: colors.surface }]}
                    onPress={() => navigation.navigate('Profile')}
                  >
                    <Text style={[styles.profileInitials, { color: colors.textPrimary }]}>
                      {user?.emailAddresses[0]?.emailAddress[0]?.toUpperCase() || 'U'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ),
            })}
          />
          <Stack.Screen
            name="ImageUpload"
            component={ImageUploadScreen}
            options={{
              title: 'Find Matching Destinations',
              headerBackTitle: 'Back',
            }}
          />
          <Stack.Screen
            name="CreatePost"
            component={CreatePostScreen}
            options={{
              title: 'Create Post',
              headerBackTitle: 'Back',
            }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              title: 'My Profile',
              headerBackTitle: 'Back',
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  plusBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIcon: {
    color: '#000',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 26,
    marginTop: -1,
  },
  profileBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.xs,
  },
  profileInitials: {
    fontWeight: typography.bold,
  }
});
