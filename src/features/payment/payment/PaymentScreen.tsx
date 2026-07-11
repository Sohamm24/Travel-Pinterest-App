import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import RazorpayCheckout from 'react-native-razorpay';
import { useUserStore } from '../../../store/userStore';
import { ShieldCheck, Lock, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react-native';
import { useTheme } from '../../../context/ThemeContext';
import { TYPOGRAPHY, SHAPES, SPACING } from '../../../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function PaymentScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { profile } = useUserStore();

  const {
    trip_confirmation_id,
    price_locked,
    total_amount,
    hold_expires_at,
    razorpay_order_id,
  } = route.params;

  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'failed' | 'expired'>('idle');
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  // Calculate remaining time
  useEffect(() => {
    const expirationTime = new Date(hold_expires_at).getTime();
    
    const updateCountdown = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((expirationTime - now) / 1000));
      setSecondsLeft(diff);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [hold_expires_at]);

  // Handle countdown hitting 0
  useEffect(() => {
    if (secondsLeft !== null && secondsLeft <= 0 && paymentStatus === 'idle') {
      setPaymentStatus('expired');
    }
  }, [secondsLeft, paymentStatus]);

  const handlePay = async () => {
    setLoading(true);

    const options = {
      description: 'Trip Booking Reservation Payment',
      image: undefined,
      currency: 'INR',
      key: process.env.EXPO_PUBLIC_RAZORPAY_API_KEY || '',
      amount: Math.round(total_amount * 100).toString(), // Razorpay expects amount in paise
      name: 'Troupe',
      order_id: razorpay_order_id,
      prefill: {
        email: profile?.email || '',
        contact: profile?.phone || '',
        name: profile?.name || '',
      },
      theme: { color: colors.primary || '#2E1065' }
    };

    try {
      console.log('Opening Razorpay Checkout native module...');
      RazorpayCheckout.open(options)
        .then((data: any) => {
          console.log('Razorpay success payload:', data);
          setPaymentStatus('success');
        })
        .catch((error: any) => {
          console.warn('Razorpay error:', error);
          setLoading(false);
          // error.code === 2 is user cancel
          if (error && error.code !== 2) {
            setPaymentStatus('failed');
            Alert.alert('Payment Failed', error.description || 'Payment failed.');
          }
        });
    } catch (e: any) {
      setLoading(false);
      setPaymentStatus('failed');
      Alert.alert('Error', e.message || 'Payment processing failed.');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // ── Success State Screen ──
  if (paymentStatus === 'success') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center' }]}>
        <View style={styles.stateContainer}>
          <CheckCircle size={80} color={colors.confirmation} />
          <Text style={[styles.stateTitle, { color: colors.textPrimary, fontFamily: TYPOGRAPHY.fontFamilyBold }]}>
            Trip Confirmed!
          </Text>
          <Text style={[styles.stateSubtitle, { color: colors.textSecondary, fontFamily: TYPOGRAPHY.fontFamily }]}>
            Your seats have been successfully reserved. Get ready for your adventure!
          </Text>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('Main')}
          >
            <Text style={[styles.actionButtonText, { fontFamily: TYPOGRAPHY.fontFamilySemiBold }]}>
              Go to Home
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Failed / Expired States ──
  if (paymentStatus === 'failed' || paymentStatus === 'expired') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center' }]}>
        <View style={styles.stateContainer}>
          <AlertCircle size={80} color={colors.error} />
          <Text style={[styles.stateTitle, { color: colors.textPrimary, fontFamily: TYPOGRAPHY.fontFamilyBold }]}>
            {paymentStatus === 'expired' ? 'Reservation Expired' : 'Payment Failed'}
          </Text>
          <Text style={[styles.stateSubtitle, { color: colors.textSecondary, fontFamily: TYPOGRAPHY.fontFamily }]}>
            {paymentStatus === 'expired'
              ? 'Your seat hold reservation time has run out. Please go back and request hold again.'
              : 'Something went wrong during payment. Please check details and try again.'}
          </Text>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.actionButtonText, { fontFamily: TYPOGRAPHY.fontFamilySemiBold }]}>
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Idle/Payment Interface ──
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonIcon}>
          <ArrowLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary, fontFamily: TYPOGRAPHY.fontFamilyBold }]}>
          Complete Payment
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {/* Reservation expiry warning */}
        {secondsLeft !== null && secondsLeft > 0 && (
          <View style={[styles.timerCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.timerLabel, { color: colors.textSecondary, fontFamily: TYPOGRAPHY.fontFamily }]}>
              Holding your seats for
            </Text>
            <Text style={[styles.timerValue, { color: colors.error, fontFamily: TYPOGRAPHY.fontFamilyBold }]}>
              {formatTime(secondsLeft)}
            </Text>
          </View>
        )}

        {/* Pricing details */}
        <View style={[styles.paymentCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.textSecondary, fontFamily: TYPOGRAPHY.fontFamilySemiBold }]}>
            PAYMENT SUMMARY
          </Text>
          <View style={styles.row}>
            <Text style={[styles.keyText, { color: colors.textSecondary, fontFamily: TYPOGRAPHY.fontFamily }]}>
              Seats Price Hold
            </Text>
            <Text style={[styles.valueText, { color: colors.textPrimary, fontFamily: TYPOGRAPHY.fontFamilySemiBold }]}>
              ₹{price_locked.toLocaleString('en-IN')}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.row}>
            <Text style={[styles.totalKeyText, { color: colors.textPrimary, fontFamily: TYPOGRAPHY.fontFamilyBold }]}>
              Total Amount
            </Text>
            <Text style={[styles.totalValueText, { color: colors.primary, fontFamily: TYPOGRAPHY.fontFamilyBold }]}>
              ₹{total_amount.toLocaleString('en-IN')}
            </Text>
          </View>
        </View>

        {/* Secure seal banner */}
        <View style={styles.secureBanner}>
          <Lock size={16} color={colors.textSecondary} style={{ marginRight: 6 }} />
          <Text style={[styles.secureText, { color: colors.textSecondary, fontFamily: TYPOGRAPHY.fontFamily }]}>
            Payments are secured and processed via Razorpay.
          </Text>
        </View>
      </View>

      {/* Action Footer */}
      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.payButton, { backgroundColor: colors.primary }]}
          onPress={handlePay}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <ShieldCheck size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={[styles.payButtonText, { fontFamily: TYPOGRAPHY.fontFamilyBold }]}>
                Pay ₹{total_amount.toLocaleString('en-IN')}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  backButtonIcon: {
    padding: 4,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.sizes.md,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
  },
  timerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: SHAPES.roundedMedium,
    borderWidth: 1,
    marginBottom: SPACING.lg,
  },
  timerLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
  },
  timerValue: {
    fontSize: TYPOGRAPHY.sizes.md,
  },
  paymentCard: {
    padding: SPACING.md,
    borderRadius: SHAPES.roundedMedium,
    borderWidth: 1,
    marginBottom: SPACING.lg,
  },
  cardTitle: {
    fontSize: 11,
    letterSpacing: 0.8,
    marginBottom: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: SPACING.xs,
  },
  keyText: {
    fontSize: TYPOGRAPHY.sizes.sm,
  },
  valueText: {
    fontSize: TYPOGRAPHY.sizes.sm,
  },
  divider: {
    height: 1,
    marginVertical: SPACING.md,
  },
  totalKeyText: {
    fontSize: TYPOGRAPHY.sizes.md,
  },
  totalValueText: {
    fontSize: TYPOGRAPHY.sizes.md,
  },
  secureBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.sm,
  },
  secureText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  footer: {
    padding: SPACING.md,
    borderTopWidth: 1,
  },
  payButton: {
    flexDirection: 'row',
    height: 52,
    borderRadius: SHAPES.roundedLarge,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  payButtonText: {
    color: '#ffffff',
    fontSize: TYPOGRAPHY.sizes.md,
  },
  stateContainer: {
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  stateTitle: {
    fontSize: 24,
    lineHeight: 32,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  stateSubtitle: {
    fontSize: TYPOGRAPHY.sizes.sm,
    textAlign: 'center',
    marginTop: SPACING.sm,
    lineHeight: 22,
  },
  actionButton: {
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: SHAPES.roundedLarge,
    width: '100%',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: TYPOGRAPHY.sizes.sm,
  },
});
