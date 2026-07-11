/**
 * features/messaging/notifications.ts
 *
 * Firebase Cloud Messaging integration via expo-notifications.
 *
 * Call registerForPushNotifications() once after the user is authenticated
 * to obtain a native FCM token and register it with the backend.
 *
 * NOTE: expo-notifications requires a physical device or emulator with
 * Google Play Services for FCM. It will not produce a token in Expo Go
 * without further configuration — use a dev-client build.
 */

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { client } from '../../utils/apiClient';

// Configure how notifications behave when the app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Request permission and register the device's FCM token with the backend.
 * Safe to call multiple times — subsequent calls are no-ops if permission
 * has already been granted and the token is unchanged.
 */
export async function registerForPushNotifications(): Promise<void> {
  if (!Device.isDevice) {
    // Push notifications require a real/emulated device
    console.log('[FCM] Skipping push registration — not a physical device');
    return;
  }

  // ── Request permission ──────────────────────────────────────────────────
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('[FCM] Push notification permission not granted');
    return;
  }

  // ── Android channel ─────────────────────────────────────────────────────
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('messages', {
      name: 'Messages',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      sound: 'default',
    });
  }

  // ── Get native FCM token ────────────────────────────────────────────────
  try {
    const tokenData = await Notifications.getDevicePushTokenAsync();
    const fcmToken = tokenData.data;

    if (!fcmToken) {
      console.warn('[FCM] Could not get device push token');
      return;
    }

    // ── Register with backend ─────────────────────────────────────────────
    await client.post('/api/v1/messaging/fcm-token', { fcm_token: fcmToken });
    console.log('[FCM] Token registered with backend:', fcmToken.slice(0, 20) + '...');
  } catch (err) {
    console.warn('[FCM] Token registration error:', err);
  }
}

/**
 * Set up listeners for when a notification is received in the foreground
 * or when the user taps a notification. Returns a cleanup function.
 */
export function setupNotificationListeners(
  onNavigate: (chatId: string) => void,
): () => void {
  // Foreground notification received
  const receivedSub = Notifications.addNotificationReceivedListener((notification) => {
    console.log('[FCM] Notification received in foreground:', notification);
  });

  // User tapped a notification
  const responseSub = Notifications.addNotificationResponseReceivedListener((response) => {
    const data = response.notification.request.content.data as any;
    if (data?.chat_id) {
      onNavigate(data.chat_id);
    }
  });

  return () => {
    receivedSub.remove();
    responseSub.remove();
  };
}
