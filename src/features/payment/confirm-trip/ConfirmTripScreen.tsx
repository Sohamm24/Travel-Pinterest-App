import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  ActivityIndicator,
  Modal,
  Dimensions,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../context/ThemeContext';
import { TYPOGRAPHY, SHAPES, SPACING } from '../../../constants/theme';
import {
  ChevronLeft,
  BadgeCheck,
  ChevronDown,
  ArrowRight,
  X,
  AlertCircle,
} from 'lucide-react-native';
import { ConfirmationData, PaymentMethod } from './types';
import { useConfirmationData, useCreateHold } from './hooks';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');


// ─── Payment Methods ──────────────────────────────────────────────────────────


const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'upi',     label: 'UPI',                subLabel: 'GPay, PhonePe, Paytm…',   icon: '🔷' },
  { id: 'card',    label: 'Credit / Debit Card', subLabel: 'Visa, Mastercard, RuPay', icon: '💳' },
  { id: 'netbank', label: 'Net Banking',          subLabel: 'All major banks',         icon: '🏦' },
  { id: 'wallet',  label: 'Wallet',              subLabel: 'Paytm, Amazon Pay…',      icon: '👛' },
  { id: 'bnpl',    label: 'Buy Now Pay Later',   subLabel: 'Simpl, LazyPay…',         icon: '🗓️' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function DateChip({ month, day, colors }: { month: string; day: string; colors: any }) {
  return (
    <View style={[styles.dateChip, { backgroundColor: colors.surface }]}>
      <Text style={[styles.dateChipMonth, { color: colors.textSecondary }]}>{month}</Text>
      <Text style={[styles.dateChipDay, { color: colors.textPrimary }]}>{day}</Text>
    </View>
  );
}

// ─── Traveller Dropdown ───────────────────────────────────────────────────────

function TravellerDropdown({
  value,
  onChange,
  availableSeats,
  colors,
}: {
  value: number;
  onChange: (n: number) => void;
  availableSeats: number;
  colors: any;
}) {
  const [open, setOpen] = useState(false);
  const [dropdownY, setDropdownY] = useState(0);
  const selectorRef = useRef<View>(null);
  const options = Array.from({ length: availableSeats }, (_, i) => i + 1);

  const handleOpen = () => {
    selectorRef.current?.measure((_x, _y, _w, h, _pageX, pageY) => {
      setDropdownY(pageY + h + 4);
    });
    setOpen(o => !o);
  };

  return (
    <View style={styles.travellerDropdownWrapper}>
      {/* Selector button */}
      <TouchableOpacity
        ref={selectorRef}
        onPress={handleOpen}
        activeOpacity={0.8}
        style={[
          styles.travellerSelector,
          {
            borderColor: colors.progressBackground,
            backgroundColor: colors.progressBackground,
          },
        ]}
      >
        <Text style={[styles.travellerSelectorValue, { color: colors.textPrimary, fontFamily: TYPOGRAPHY.fontFamilySemiBold }]}>
          {value}
        </Text>
        <ChevronDown size={16} color={colors.textSecondary} />
      </TouchableOpacity>

      {/* Dropdown — rendered in Modal to escape ScrollView clipping */}
      {open && (
        <Modal transparent animationType="none" onRequestClose={() => setOpen(false)}>
          <TouchableWithoutFeedback onPress={() => setOpen(false)}>
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>

          <View style={[
            styles.travellerDropdownList,
            {
              position: 'absolute',
              top: dropdownY,
              right: SPACING.md,
              borderColor: colors.border,
              backgroundColor: colors.background,
              shadowColor: colors.textPrimary,
            },
          ]}>
            <ScrollView
              style={{ maxHeight: 352 }}
              showsVerticalScrollIndicator
              indicatorStyle="black"
            >
              {options.map((n, idx) => (
                <TouchableOpacity
                  key={n}
                  onPress={() => { onChange(n); setOpen(false); }}
                  style={[
                    styles.travellerOption,
                    idx < options.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
                    value === n && { backgroundColor: colors.primaryDim },
                  ]}
                >
                  <Text style={[
                    styles.travellerOptionText,
                    {
                      color: value === n ? colors.primary : colors.textPrimary,
                      fontFamily: value === n ? TYPOGRAPHY.fontFamilySemiBold : TYPOGRAPHY.fontFamily,
                    },
                  ]}>
                    {n}
                  </Text>
                  {value === n && (
                    <View style={[styles.radioSelected, { backgroundColor: colors.secondary }]} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Modal>
      )}
    </View>
  );
}

// ─── Payment Bottom Sheet ─────────────────────────────────────────────────────

function PaymentBottomSheet({
  visible,
  selectedId,
  onSelect,
  onClose,
  colors,
}: {
  visible: boolean;
  selectedId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
  colors: any;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.sheetOverlay} />
      </TouchableWithoutFeedback>

      <View style={[styles.sheetContainer, { backgroundColor: colors.background }]}>
        <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />

        <View style={styles.sheetHeader}>
          <Text style={[styles.sheetTitle, { color: colors.textPrimary, fontFamily: TYPOGRAPHY.fontFamilySemiBold }]}>
            Pay using
          </Text>
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <X size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {PAYMENT_METHODS.map((method, idx) => (
          <TouchableOpacity
            key={method.id}
            onPress={() => { onSelect(method.id); onClose(); }}
            activeOpacity={0.75}
            style={[
              styles.sheetOption,
              idx < PAYMENT_METHODS.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
              selectedId === method.id && { backgroundColor: colors.primaryDim },
            ]}
          >
            <Text style={styles.paymentIcon}>{method.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.paymentLabel, { color: colors.textPrimary, fontFamily: TYPOGRAPHY.fontFamilySemiBold }]}>
                {method.label}
              </Text>
              {method.subLabel && (
                <Text style={[styles.paymentSub, { color: colors.textSecondary, fontFamily: TYPOGRAPHY.fontFamily }]}>
                  {method.subLabel}
                </Text>
              )}
            </View>
            {selectedId === method.id && (
              <View style={[styles.radioSelected, { backgroundColor: colors.secondary }]} />
            )}
          </TouchableOpacity>
        ))}

        <View style={{ height: 24 }} />
      </View>
    </Modal>
  );
}

// ─── Cost Breakdown ───────────────────────────────────────────────────────────

function CostBreakdown({
  perSeat,
  travellers,
  colors,
}: {
  perSeat: number;
  travellers: number;
  colors: any;
}) {
  const subtotal = perSeat * travellers;
  const taxes = 0;
  const total = subtotal + taxes;

  return (
    <View style={[styles.breakdownCard, { backgroundColor: colors.dim ?? colors.surface, borderColor: colors.border }]}>
      <Text style={[styles.sectionLabel, { color: colors.textSecondary, fontFamily: TYPOGRAPHY.fontFamilySemiBold, marginBottom: SPACING.sm }]}>
        Cost Breakdown
      </Text>

      <View style={styles.breakdownRow}>
        <Text style={[styles.breakdownKey, { color: colors.textSecondary, fontFamily: TYPOGRAPHY.fontFamily }]}>
          Per seat
        </Text>
        <Text style={[styles.breakdownVal, { color: colors.textPrimary, fontFamily: TYPOGRAPHY.fontFamilySemiBold }]}>
          ₹{perSeat.toLocaleString('en-IN')}
        </Text>
      </View>

      <View style={styles.breakdownRow}>
        <Text style={[styles.breakdownKey, { color: colors.textSecondary, fontFamily: TYPOGRAPHY.fontFamily }]}>
          ₹{perSeat.toLocaleString('en-IN')} × {travellers} {travellers === 1 ? 'seat' : 'seats'}
        </Text>
        <Text style={[styles.breakdownVal, { color: colors.textPrimary, fontFamily: TYPOGRAPHY.fontFamilySemiBold }]}>
          ₹{subtotal.toLocaleString('en-IN')}
        </Text>
      </View>

      <View style={styles.breakdownRow}>
        <Text style={[styles.breakdownKey, { color: colors.textSecondary, fontFamily: TYPOGRAPHY.fontFamily }]}>
          Taxes & fees
        </Text>
        <Text style={[styles.breakdownVal, { color: colors.textSecondary, fontFamily: TYPOGRAPHY.fontFamilySemiBold }]}>
          ₹0
        </Text>
      </View>

      <View style={[styles.breakdownDivider, { backgroundColor: colors.border }]} />

      <View style={styles.breakdownRow}>
        <Text style={[styles.breakdownTotalKey, { color: colors.textPrimary, fontFamily: TYPOGRAPHY.fontFamilySemiBold }]}>
          Total
        </Text>
        <Text style={[styles.breakdownTotalVal, { color: colors.primary, fontFamily: TYPOGRAPHY.fontFamilySemiBold }]}>
          ₹{total.toLocaleString('en-IN')}
        </Text>
      </View>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ConfirmTripScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { colors } = useTheme();

  const tripId = route.params?.tripId;

  const { data: confirmationData, isLoading, error, refetch } = useConfirmationData(tripId);
  const createHoldMutation = useCreateHold();

  const [travellers, setTravellers] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState<string>('card'); // Card is default for native Stripe
  const [paymentSheetVisible, setPaymentSheetVisible] = useState(false);
  const [seatError, setSeatError] = useState<{ code: string; seats_left: number; message?: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Generate unique idempotency key for this hold attempt
  const [idempotencyKey, setIdempotencyKey] = useState(() => `idemp-${tripId}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);

  const handleTravellerChange = (val: number) => {
    setTravellers(val);
    setSeatError(null);
    // Refresh idempotency key when changing traveler count
    setIdempotencyKey(`idemp-${tripId}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (error || !confirmationData) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: SPACING.lg }]}>
        <Text style={[styles.tripTitle, { color: colors.error, textAlign: 'center', fontFamily: TYPOGRAPHY.fontFamilyBold }]}>
          Failed to load confirmation details.
        </Text>
        <TouchableOpacity style={[styles.confirmBtn, { backgroundColor: colors.primary, marginTop: SPACING.md }]} onPress={() => refetch()}>
          <Text style={{ color: '#fff', fontFamily: TYPOGRAPHY.fontFamilySemiBold }}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const availableSeats = Math.max(
    0,
    (confirmationData.max_travellers ?? 0) - (confirmationData.confirmed_travellers ?? 0),
  );

  const firstItineraryDate = confirmationData.itinerary?.length > 0
    ? new Date(confirmationData.itinerary[0].time)
    : null;
  const lastItineraryDate = confirmationData.itinerary?.length > 0
    ? new Date(confirmationData.itinerary[confirmationData.itinerary.length - 1].time)
    : null;

  const dates = {
    startMonth: firstItineraryDate?.toLocaleString('default', { month: 'short' }) ?? '',
    startDay: firstItineraryDate?.getDate().toString() ?? '',
    endMonth: lastItineraryDate?.toLocaleString('default', { month: 'short' }) ?? '',
    endDay: lastItineraryDate?.getDate().toString() ?? '',
  };

  const perSeat = confirmationData.confirmation_amount ?? 0;
  const totalAmount = perSeat * travellers;
  const selectedMethod = PAYMENT_METHODS.find(m => m.id === selectedPayment);

  const handleConfirm = () => {
    if (!tripId) return;
    setSeatError(null);
    setIsProcessing(true);

    createHoldMutation.mutate(
      {
        trip_id: tripId,
        seats_count: travellers,
        idempotency_key: idempotencyKey,
      },
      {
        onSuccess: (data) => {
          console.log("Hold response:", data);
          navigation.navigate('PaymentScreen', {
            trip_confirmation_id: data.trip_confirmation_id,
            price_locked: Number(data.price_locked),
            total_amount: Number(data.total_amount),
            hold_expires_at: data.hold_expires_at,
            razorpay_order_id: data.razorpay_order_id,
          });
          setIsProcessing(false);
        },
        onError: (err: any) => {
          setIsProcessing(false);
          const detail = err.response?.data?.detail;
          if (detail && (detail.code === 'SOLD_OUT' || detail.code === 'NOT_ENOUGH_SEATS')) {
            setSeatError(detail);
          } else {
            setSeatError({
              code: 'GENERIC_ERROR',
              seats_left: availableSeats,
              message: detail?.message || err.message || 'Hold creation failed. Please try again.',
            });
          }
        },
      }
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>

      {/* ── Hero ── */}
      <View style={[styles.hero, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color="#fff" size={22} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* ── Traveller selector ── */}
        <View style={[styles.travellerCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Text style={[styles.travellerLabel, { color: colors.textSecondary, fontFamily: TYPOGRAPHY.fontFamilySemiBold }]}>
            Select number of people traveling with you
          </Text>
          <TravellerDropdown
            value={travellers}
            onChange={handleTravellerChange}
            availableSeats={availableSeats}
            colors={colors}
          />
        </View>

        {seatError && (
          <View style={[styles.errorBanner, { borderColor: colors.error }]}>
            <AlertCircle size={18} color={colors.error} style={{ marginRight: SPACING.xs }} />
            <Text style={[styles.errorText, { color: colors.error, fontFamily: TYPOGRAPHY.fontFamilySemiBold }]}>
              {seatError.code === 'SOLD_OUT' && "This trip is fully booked!"}
              {seatError.code === 'NOT_ENOUGH_SEATS' && `Only ${seatError.seats_left} seats left! Please adjust group size.`}
              {seatError.code === 'GENERIC_ERROR' && (seatError.message || "Failed to reserve seats.")}
            </Text>
          </View>
        )}

        {/* ── Trip title ── */}
        <Text style={[styles.tripTitle, { color: colors.textPrimary, fontFamily: TYPOGRAPHY.fontFamilyBold }]}>
          {confirmationData.title}
        </Text>

        {/* ── Dates ── */}
        {(firstItineraryDate || lastItineraryDate) && (
          <View style={styles.datesSection}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Dates</Text>
            <View style={styles.dateRow}>
              <DateChip month={dates.startMonth} day={dates.startDay} colors={colors} />
              {dates.endMonth && dates.endDay && (
                <DateChip month={dates.endMonth} day={dates.endDay} colors={colors} />
              )}
            </View>
          </View>
        )}

        {/* ── Organizer card ── */}
        {confirmationData.organizer && (
          <View style={[styles.organizerCard]}>
            <View style={styles.organizerTop}>
              <View style={styles.organizerInfo}>
                {confirmationData.organizer.profile_pic ? (
                  <Image
                    source={{ uri: confirmationData.organizer.profile_pic }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={[styles.avatar, { backgroundColor: colors.secondary, justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={[styles.avatarInitial, { fontFamily: TYPOGRAPHY.fontFamilyBold }]}>
                      {confirmationData.organizer.name.charAt(0)}
                    </Text>
                  </View>
                )}
                <View>
                  <View style={styles.nameRow}>
                    <Text style={[styles.organizerName, { color: colors.textPrimary, fontFamily: TYPOGRAPHY.fontFamilySemiBold }]}>
                      {confirmationData.organizer.name}
                    </Text>
                    {confirmationData.organizer.verification_status && (
                      <BadgeCheck size={16} color={colors.primary} style={{ marginLeft: 4 }} />
                    )}
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.messageBtn, { backgroundColor: colors.background, borderColor: colors.border, borderWidth: 1 }]}
                onPress={() =>
                  navigation.navigate('ChatMessages', {
                    organizerUserId: confirmationData.organizer?.user_id ?? '',
                    organizerName: confirmationData.organizer?.name ?? 'Organizer',
                    organizerPic: confirmationData.organizer?.profile_pic ?? null,
                    organizerProfileId: confirmationData.organizer?.organizer_id ?? null,
                    isVerified: confirmationData.organizer?.verification_status ?? false,
                  })
                }
              >
                <Text style={[styles.messageBtnText, { color: colors.textPrimary, fontFamily: TYPOGRAPHY.fontFamilySemiBold }]}>
                  Message
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.organizerHint, { color: colors.textSecondary, fontFamily: TYPOGRAPHY.fontFamily }]}>
              You may contact the organizer in case of queries or meeting point related updates
            </Text>
          </View>
        )}

        {/* ── Cost Breakdown ── */}
        <CostBreakdown
          perSeat={perSeat}
          travellers={travellers}
          colors={colors}
        />

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* ── Sticky bottom bar ── */}
      <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={styles.totalSection}
          onPress={() => setPaymentSheetVisible(true)}
          activeOpacity={0.7}
        >
          <Text style={[styles.payUsingLabel, { color: colors.textSecondary, fontFamily: TYPOGRAPHY.fontFamilySemiBold }]}>
            PAY USING
          </Text>
          <View style={styles.payUsingRow}>
            <Text style={[styles.payUsingMethod, { color: colors.textPrimary, fontFamily: TYPOGRAPHY.fontFamilySemiBold }]}>
              {selectedMethod?.label}
            </Text>
            <ChevronDown size={13} color={colors.textSecondary} style={{ marginLeft: 3, marginTop: 1 }} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.confirmBtn, { backgroundColor: colors.confirmation }]}
          onPress={handleConfirm}
          disabled={isLoading || isProcessing}
          activeOpacity={0.85}
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color={colors.background} />
          ) : (
            <>
              <View>
                <Text style={[styles.confirmBtnAmount, { fontFamily: TYPOGRAPHY.fontFamilySemiBold, color: colors.background }]}>
                  ₹{totalAmount.toLocaleString('en-IN')}
                </Text>
                <Text style={[styles.confirmBtnTotal, { fontFamily: TYPOGRAPHY.fontFamilySemiBold, color: colors.background }]}>
                  TOTAL
                </Text>
              </View>
              <View style={[styles.confirmBtnDivider, { backgroundColor: 'rgba(255,255,255,0.3)' }]} />
              <Text style={[styles.confirmBtnLabel, { fontFamily: TYPOGRAPHY.fontFamilySemiBold, color: colors.background }]}>
                Confirm Trip
              </Text>
              <ArrowRight size={18} color={colors.background} style={{ marginLeft: 4 }} />
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* ── Payment bottom sheet ── */}
      <PaymentBottomSheet
        visible={paymentSheetVisible}
        selectedId={selectedPayment}
        onSelect={setSelectedPayment}
        onClose={() => setPaymentSheetVisible(false)}
        colors={colors}
      />

    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Hero
  hero: {
    height: 140,
    paddingTop: SPACING.xl,
    paddingHorizontal: SPACING.md,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: SHAPES.roundedFull,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Scroll
  scroll: { flex: 1, marginTop: -20 },
  scrollContent: { paddingHorizontal: SPACING.md, paddingTop: SPACING.sm },

  // Traveller card
  travellerCard: {
    borderRadius: SHAPES.roundedMedium,
    borderWidth: 1,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  travellerLabel: {
    flex: 1,
    fontSize: TYPOGRAPHY.sizes.xs,
    lineHeight: 20,
  },

  // Traveller dropdown
  travellerDropdownWrapper: {
    position: 'relative',
  },
  travellerSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    borderWidth: 0.5,
    borderRadius: SHAPES.roundedSmall,
    paddingVertical: SPACING.sm - 2,
    paddingHorizontal: SPACING.sm,
  },
  travellerSelectorValue: {
    fontSize: TYPOGRAPHY.sizes.sm,
  },
  travellerDropdownList: {
    minWidth: 80,
    borderWidth: 0.5,
    borderRadius: SHAPES.roundedMedium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 16,
  },
  travellerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  travellerOptionText: {
    flex: 1,
    fontSize: TYPOGRAPHY.sizes.sm,
  },

  // Trip title
  tripTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    lineHeight: 28,
    marginBottom: SPACING.lg,
  },

  // Dates
  datesSection: { marginBottom: SPACING.lg },
  sectionLabel: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '600',
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  statLabel: { fontSize: TYPOGRAPHY.sizes.sm, fontFamily: TYPOGRAPHY.fontFamily, marginBottom: 6 },
  dateRow: { flexDirection: 'row', gap: 6, width: '33%' },
  dateChip: { flex: 1, borderRadius: SHAPES.roundedSmall, paddingHorizontal: SPACING.sm, paddingVertical: 2, alignItems: 'center' },
  dateChipMonth: { fontSize: 9, fontFamily: TYPOGRAPHY.fontFamilySemiBold },
  dateChipDay: { fontSize: TYPOGRAPHY.sizes.sm, fontFamily: TYPOGRAPHY.fontFamilyBold },

  // Organizer
  organizerCard: {
    borderRadius: SHAPES.roundedMedium,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  organizerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  organizerInfo: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  avatar: { width: 44, height: 44, borderRadius: SHAPES.roundedFull },
  avatarInitial: { fontSize: TYPOGRAPHY.sizes.lg },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  organizerName: { fontSize: TYPOGRAPHY.sizes.md },
  messageBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: SHAPES.roundedSmall
  },
  messageBtnText: { fontSize: TYPOGRAPHY.sizes.sm },
  organizerHint: { fontSize: TYPOGRAPHY.sizes.sm, lineHeight: 20 },

  // Cost breakdown
  breakdownCard: {
    borderRadius: SHAPES.roundedMedium,
    borderWidth: StyleSheet.hairlineWidth,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  breakdownKey: { fontSize: TYPOGRAPHY.sizes.sm },
  breakdownVal: { fontSize: TYPOGRAPHY.sizes.sm },
  breakdownDivider: { height: StyleSheet.hairlineWidth, marginVertical: SPACING.sm },
  breakdownTotalKey: { fontSize: TYPOGRAPHY.sizes.md },
  breakdownTotalVal: { fontSize: TYPOGRAPHY.sizes.md },

  // Payment shared
  paymentIcon: { fontSize: 22 },
  paymentLabel: { fontSize: TYPOGRAPHY.sizes.md },
  paymentSub: { fontSize: TYPOGRAPHY.sizes.xs, marginTop: 2 },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: SHAPES.roundedFull,
  },

  // Payment bottom sheet
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: SHAPES.roundedLarge,
    borderTopRightRadius: SHAPES.roundedLarge,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: SPACING.md,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sheetTitle: { fontSize: TYPOGRAPHY.sizes.md },
  sheetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },

  // Bottom bar
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: SPACING.sm,
  },
  totalSection: { flex: 1 },
  payUsingLabel: { fontSize: 10, letterSpacing: 0.8, textTransform: 'uppercase' },
  payUsingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  payUsingMethod: { fontSize: TYPOGRAPHY.sizes.sm },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: SHAPES.roundedLarge,
    paddingVertical: SPACING.md - 2,
    paddingHorizontal: SPACING.md,
    gap: SPACING.xs,
    flex: 2,
    justifyContent: 'center',
  },
  confirmBtnAmount: { fontSize: TYPOGRAPHY.sizes.lg, lineHeight: 28 },
  confirmBtnTotal: { fontSize: TYPOGRAPHY.sizes.xs, letterSpacing: 0.6 },
  confirmBtnDivider: {
    width: 1,
    height: 32,
    marginHorizontal: SPACING.xs,
  },
  confirmBtnLabel: { fontSize: TYPOGRAPHY.sizes.sm },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: SHAPES.roundedMedium,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    flex: 1,
    fontSize: TYPOGRAPHY.sizes.xs,
    lineHeight: 18,
  },
});