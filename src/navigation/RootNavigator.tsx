import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuthStore } from '../store/authStore';
import { useUserStore } from '../store/userStore';
import { profileApi } from '../features/traveler/profile/api';
import MainTabNavigator from './MainTabNavigator';
import { useTheme } from '../context/ThemeContext';

import LoginScreen from '../features/auth/LoginScreen';
import RegisterScreen from '../features/auth/RegisterScreen';
import TripDetailsScreen from '../features/traveler/trip-details/TripDetailsScreen';
import CreateTripScreen from '../features/organizer/create-trip/Create-trip-form';
import EditTripScreen from '../features/organizer/edit-trip/EditTripScreen';
import EditProfileScreen from '../features/traveler/profile/components/Edit-Profile';
import OrganizerPublicProfile from '../features/traveler/organizer-details/OrganizerProfilePage';
import AppearanceScreen from '../features/shared/AppearanceScreen';
import SavedTripsScreen from '../features/traveler/profile/components/Saved-trips';
import ReviewsScreen from '../features/traveler/profile/components/Reviews';
import AboutUsScreen from '../features/traveler/profile/components/About-us';
import CustomerCareScreen from '../features/traveler/profile/components/Customer-care';
import SettingsScreen from '../features/traveler/profile/components/Settings';
import PaymentMethodsScreen from '../features/traveler/profile/components/Payment-methods';
import TripHistoryScreen from '../features/traveler/profile/components/Trip-details';
import EditOrganizerProfileScreen from '../features/organizer/organizer-profile/components/Edit-Profile';
import EarningsScreen from '../features/organizer/organizer-profile/components/Earnings';
import OrganizerSupportScreen from '../features/organizer/organizer-profile/components/Organizer-support';
import OrganizerVerificationScreen from '../features/organizer/organizer-verification/Organizer-verification-form';
import ConfirmTripScreen from '../features/payment/confirm-trip/ConfirmTripScreen';
import PaymentScreen from '../features/payment/payment/PaymentScreen';
import MessageScreen from 'src/features/messaging/components/MessageScreen';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Main: undefined;
  TripDetails: { tripId: string };
  CreateTrip: undefined;
  EditTrip: { tripId: string };
  EditProfile: undefined;
  ChatMessages: {
    organizerUserId: string;
    organizerName: string;
    organizerPic: string | null;
    organizerProfileId: string | null;
    isVerified: boolean;
  };
  OrganizerPublicProfile: { organizerId: string };
  Appearance: undefined;
  SavedTrips: undefined;
  Reviews: undefined;
  AboutUs: undefined;
  CustomerCare: undefined;
  Settings: undefined;
  PaymentMethods: undefined;
  TripHistory: undefined;
  EditOrganizerProfile: undefined;
  Earnings: undefined;
  OrganizerSupport: undefined;
  OrganizerVerification: undefined;
  ViewItinerary: { tripId: string };
  ConfirmTrip: { tripId: string };
  PaymentScreen: {
    trip_confirmation_id: string;
    price_locked: number;
    total_amount: number;
    hold_expires_at: string;
    razorpay_order_id: string;
  };
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator(): React.JSX.Element {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const { profile, setProfile, clearUser } = useUserStore();
  const { colors } = useTheme();
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      clearUser();
    }
  }, [isLoading, isAuthenticated, clearUser]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (isAuthenticated && !profile) {
        setProfileLoading(true);
        try {
          const data = await profileApi.getMe();
          setProfile(data);
        } catch (err) {
          console.error('Failed to fetch user profile in RootNavigator:', err);
        } finally {
          setProfileLoading(false);
        }
      }
    };
    fetchProfile();
  }, [isAuthenticated, profile, setProfile]);

  if (isLoading || (isAuthenticated && !profile && profileLoading)) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      {!isAuthenticated ? (
        <>
          <RootStack.Screen name="Login" component={LoginScreen} />
          <RootStack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          <RootStack.Screen name="Main" component={MainTabNavigator} />
          <RootStack.Screen name="TripDetails" component={TripDetailsScreen} />
          <RootStack.Screen name="CreateTrip" component={CreateTripScreen} />
          <RootStack.Screen name="EditTrip" component={EditTripScreen} />
          <RootStack.Screen name="EditProfile" component={EditProfileScreen} />
          <RootStack.Screen name="ChatMessages" component={MessageScreen} />
          <RootStack.Screen name="OrganizerPublicProfile" component={OrganizerPublicProfile} />
          <RootStack.Screen name="Appearance" component={AppearanceScreen} />
          <RootStack.Screen name="SavedTrips" component={SavedTripsScreen} />
          <RootStack.Screen name="Reviews" component={ReviewsScreen} />
          <RootStack.Screen name="AboutUs" component={AboutUsScreen} />
          <RootStack.Screen name="CustomerCare" component={CustomerCareScreen} />
          <RootStack.Screen name="Settings" component={SettingsScreen} />
          <RootStack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
          <RootStack.Screen name="TripHistory" component={TripHistoryScreen} />
          <RootStack.Screen name="EditOrganizerProfile" component={EditOrganizerProfileScreen} />
          <RootStack.Screen name="Earnings" component={EarningsScreen} />
          <RootStack.Screen name="OrganizerSupport" component={OrganizerSupportScreen} />
          <RootStack.Screen name="OrganizerVerification" component={OrganizerVerificationScreen} />
          <RootStack.Screen name="ConfirmTrip" component={ConfirmTripScreen} />
          <RootStack.Screen name="PaymentScreen" component={PaymentScreen} />
        </>
      )}
    </RootStack.Navigator>
  );
}
