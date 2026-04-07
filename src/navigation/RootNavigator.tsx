import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FeedScreen from '../screens/feed/FeedScreen';
import ImageUploadScreen from '../screens/upload/ImageUploadScreen';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import { spacing } from '../constants/spacing';
import { typography } from '../constants/typography';

export type RootStackParamList = {
  Feed: undefined;
  ImageUpload: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator(): React.JSX.Element {
  const { colors } = useTheme();

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
      <Stack.Screen
        name="Feed"
        component={FeedScreen}
        options={({ navigation }) => ({
          title: 'TravelPinterest',
          headerRight: () => (
            <View style={styles.headerRight}>
              <ThemeToggle />
              <TouchableOpacity
                style={[
                  styles.plusBtn,
                  { backgroundColor: colors.primary },
                ]}
                onPress={() => navigation.navigate('ImageUpload')}
                accessibilityLabel="Find matching destinations"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.plusIcon}>+</Text>
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
          headerTitleStyle: {
            fontWeight: typography.bold,
            fontSize: typography.md,
            color: colors.textPrimary,
          },
        }}
      />
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
});
