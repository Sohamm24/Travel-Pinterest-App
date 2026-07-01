import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Compass, Users, User, Map, MessageCircle, Briefcase } from 'lucide-react-native';

// Screens — Traveler mode
import LandingPageScreen from '../features/traveler/home/LandingPageScreen';
import OrganizersScreen from '../features/traveler/organizers/OrganizersScreen';
import TravellerProfileScreen from '../features/traveler/profile/TravellerProfileScreen';

// Screens — Organizer mode
import TripDashboard from '../features/organizer/trips-dashboard/TripDashboard';
import TripDiscussionScreen from '../features/organizer/trip-discussions/TripDiscussionScreen';
import OrganizerProfileScreen from '../features/organizer/organizer-profile/OrganizerProfileScreen';

// State
import { useUserStore } from '../store/userStore';

// Theme
import { TYPOGRAPHY } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

export type MainTabParamList = {
  HomeTab: undefined;
  OrganizersTab: undefined;
  ProfileTab: undefined;
  OrgTripsTab: undefined;
  OrgDiscussionsTab: undefined;
  OrgProfileTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  const isOrganizerMode = useUserStore((s) => s.isOrganizerMode);
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.surface,
          elevation: 0,
          shadowOpacity: 0,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontFamily: TYPOGRAPHY.fontFamilySemiBold,
          fontSize: 11,
        },
      }}
    >
      {isOrganizerMode ? (
        <>
          <Tab.Screen
            name="OrgTripsTab"
            component={TripDashboard}
            options={{
              tabBarLabel: 'Trips',
              tabBarIcon: ({ color, size }) => <Map color={color} size={size} />,
            }}
          />
          <Tab.Screen
            name="OrgDiscussionsTab"
            component={TripDiscussionScreen}
            options={{
              tabBarLabel: 'Discussions',
              tabBarIcon: ({ color, size }) => <MessageCircle color={color} size={size} />,
            }}
          />
          <Tab.Screen
            name="OrgProfileTab"
            component={OrganizerProfileScreen}
            options={{
              tabBarLabel: 'Profile',
              tabBarIcon: ({ color, size }) => <Briefcase color={color} size={size} />,
            }}
          />
        </>
      ) : (
        <>
          <Tab.Screen
            name="HomeTab"
            component={LandingPageScreen}
            options={{
              tabBarLabel: 'Home',
              tabBarIcon: ({ color, size }) => <Compass color={color} size={size} />,
            }}
          />
          <Tab.Screen
            name="OrganizersTab"
            component={OrganizersScreen}
            options={{
              tabBarLabel: 'Organizer',
              tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
            }}
          />
          <Tab.Screen
            name="ProfileTab"
            component={TravellerProfileScreen}
            options={{
              tabBarLabel: 'Profile',
              tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
            }}
          />
        </>
      )}
    </Tab.Navigator>
  );
}
