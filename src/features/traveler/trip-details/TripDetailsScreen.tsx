import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Dimensions,
  Animated,
  Modal,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../context/ThemeContext';
import { TYPOGRAPHY, SHAPES, SPACING } from '../../../constants/theme';
import {
  ChevronLeft,
  Bookmark,
  PersonStanding,
  Plus,
  Minus,
  BadgeCheck,
  Star,
  Map as MapIcon,
  X,
} from 'lucide-react-native';
import { useTripDetails, useToggleInterest } from './hooks';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HERO_HEIGHT = 300;
const STATUS_PADDING = SPACING.xl + 10;
const HEADER_ROW_HEIGHT = 44;
// distance (in px of scroll) over which the header crossfades from
// "transparent over image" to "solid white bar" — Zomato-style glide
const HEADER_FADE_DISTANCE = HERO_HEIGHT - HEADER_ROW_HEIGHT - STATUS_PADDING;

const GEOAPIFY_KEY = process.env.EXPO_PUBLIC_GEOAPIFY_KEY;

function formatDateRange(start?: string, end?: string) {
  if (!start) return null;
  const s = new Date(start);
  const e = end ? new Date(end) : null;
  return {
    startMonth: s.toLocaleString('en-IN', { month: 'short' }).toUpperCase(),
    startDay: String(s.getDate()).padStart(2, '0'),
    endMonth: e ? e.toLocaleString('en-IN', { month: 'short' }).toUpperCase() : null,
    endDay: e ? String(e.getDate()).padStart(2, '0') : null,
  };
}

function DateChip({ month, day, colors }: { month: string; day: string; colors: any }) {
  return (
    <View style={[styles.dateChip, { backgroundColor: colors.surface }]}>
      <Text style={[styles.dateChipMonth, { color: colors.textSecondary }]}>{month}</Text>
      <Text style={[styles.dateChipDay, { color: colors.textPrimary }]}>{day}</Text>
    </View>
  );
}

function FAQRow({ question, answer, colors }: { question: string; answer: string; colors: any }) {
  const [open, setOpen] = useState(false);
  return (
    <TouchableOpacity
      style={[styles.faqRow, { backgroundColor: colors.dim }]}
      onPress={() => setOpen((v) => !v)}
      activeOpacity={0.75}
    >
      <View style={styles.faqHeader}>
        <Text style={[styles.faqQuestion, { color: colors.textPrimary }]}>{question}</Text>
        {open
          ? <Minus color={colors.textSecondary} size={18} />
          : <Plus color={colors.textSecondary} size={18} />
        }
      </View>
      {open && <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>{answer}</Text>}
    </TouchableOpacity>
  );
}

function SectionHeading({ label, colors }: { label: string; colors: any }) {
  return (
    <View style={styles.sectionHeadingRow}>
      <View style={[styles.sectionDot, { backgroundColor: colors.secondary }]} />
      <Text style={[styles.sectionHeadingText, { color: colors.secondary }]}>{label}</Text>
    </View>
  );
}

// Two icons (light-on-image / dark-on-header) cross-fade on top of an
// animated translucent circle so the button visually "melts" into the
// solid header bar as the user scrolls — same trick Zomato uses.
function AnimatedHeaderIcon({
  IconCmp,
  circleOpacity,
  lightOpacity,
  darkOpacity,
  colors,
  fillLight,
  fillDark,
}: {
  IconCmp: any;
  circleOpacity: Animated.AnimatedInterpolation<number>;
  lightOpacity: Animated.AnimatedInterpolation<number>;
  darkOpacity: Animated.AnimatedInterpolation<number>;
  colors: any;
  fillLight?: string;
  fillDark?: string;
}) {
  return (
    <View style={styles.headerIconWrap}>
      <Animated.View style={[styles.headerIconCircle, { opacity: circleOpacity }]} />
      <Animated.View style={[styles.headerIconLayer, { opacity: lightOpacity }]}>
        <IconCmp color="#fff" fill={fillLight || 'transparent'} size={20} />
      </Animated.View>
      <Animated.View style={[styles.headerIconLayer, { opacity: darkOpacity }]}>
        <IconCmp color={colors.textPrimary} fill={fillDark || 'transparent'} size={20} />
      </Animated.View>
    </View>
  );
}


export default function TripDetailsScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { tripId } = route.params;

  const { data: trip, isLoading } = useTripDetails(tripId);
  const toggleInterestMutation = useToggleInterest(tripId);

  const [bookmarked, setBookmarked] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [itineraryModalVisible, setItineraryModalVisible] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  const interested = trip?.is_interested ?? false;


  const routeStops = useMemo(
    () =>
      (trip?.itinerary || []).filter(
        (stop: any) =>
          stop?.location &&
          typeof stop.location.lat === 'number' &&
          typeof stop.location.lng === 'number'
      ),
    [trip]
  );

  // TEMP DEBUG — remove once confirmed working (kept short on purpose)
  useEffect(() => {
    console.log('[routeMap] routeStops count:', routeStops.length);
  }, [routeStops]);


  const handleToggleInterest = () => {
    toggleInterestMutation.mutate(interested);
  };

  const onCarouselScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveSlide(idx);
  };

  // ---- animated header interpolations ----
  const headerBgOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_FADE_DISTANCE],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [HEADER_FADE_DISTANCE * 0.55, HEADER_FADE_DISTANCE],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const iconCircleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_FADE_DISTANCE],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  const iconLightOpacity = scrollY.interpolate({
    inputRange: [HEADER_FADE_DISTANCE * 0.45, HEADER_FADE_DISTANCE],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  const iconDarkOpacity = scrollY.interpolate({
    inputRange: [HEADER_FADE_DISTANCE * 0.55, HEADER_FADE_DISTANCE],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  if (isLoading) {
    return (
      <View style={[styles.loaderContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (!trip) {
    return (
      <View style={[styles.loaderContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>Trip not found</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backButtonInline, { backgroundColor: colors.surface }]}>
          <Text style={[styles.backButtonText, { color: colors.textPrimary }]}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const slides: string[] = [];
  if (trip?.thumbnail) slides.push(trip.thumbnail);
  trip?.itinerary?.forEach((stop: any) => {
    if (stop.media) {
      slides.push(stop.media);
    } else {
      stop.activities?.forEach((act: any) => {
        if (act.image) slides.push(act.image);
      });
    }
  });
  if (slides.length === 0) slides.push('');

  const firstItineraryDate = trip.itinerary?.length > 0 ? new Date(trip.itinerary[0].time) : null;
  const lastItineraryDate = trip.itinerary?.length > 0 ? new Date(trip.itinerary[trip.itinerary.length - 1].time) : null;

  const dates = {
    startMonth: firstItineraryDate?.toLocaleString('default', { month: 'short' }) ?? '',
    startDay: firstItineraryDate?.getDate().toString() ?? '',
    endMonth: lastItineraryDate?.toLocaleString('default', { month: 'short' }) ?? '',
    endDay: lastItineraryDate?.getDate().toString() ?? '',
  };

  const interestedCount = trip.interested_count ?? 0;
  const totalReviews = trip.organizer?.total_reviews ?? 0;


  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Animated header — transparent over the hero image, glides into a
          solid bar with the title as the user scrolls (Zomato-style) */}
      <Animated.View style={[styles.animatedHeader, { paddingTop: STATUS_PADDING }]}>
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: colors.background,
              opacity: headerBgOpacity,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            },
          ]}
        />
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AnimatedHeaderIcon
              IconCmp={ChevronLeft}
              circleOpacity={iconCircleOpacity}
              lightOpacity={iconLightOpacity}
              darkOpacity={iconDarkOpacity}
              colors={colors}
            />
          </TouchableOpacity>

          <Animated.Text
            style={[styles.stickyTitle, { color: colors.textPrimary, opacity: headerTitleOpacity }]}
            numberOfLines={1}
          >
            {trip.title}
          </Animated.Text>

          <TouchableOpacity onPress={() => setBookmarked((b) => !b)}>
            <AnimatedHeaderIcon
              IconCmp={Bookmark}
              circleOpacity={iconCircleOpacity}
              lightOpacity={iconLightOpacity}
              darkOpacity={iconDarkOpacity}
              colors={colors}
              fillLight={bookmarked ? '#fff' : 'transparent'}
              fillDark={bookmarked ? colors.primary : 'transparent'}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <View style={[styles.heroWrapper, { backgroundColor: colors.surface }]}>
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} onMomentumScrollEnd={onCarouselScroll} scrollEventThrottle={16}>
            {slides.map((uri, i) => (
              <View key={i} style={styles.heroSlide}>
                {uri ? <Image source={{ uri }} style={styles.heroImage} /> : <View style={[styles.heroImage, { backgroundColor: colors.ternary }]} />}
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={[styles.contentSheet, { backgroundColor: colors.background }]}>
          <View style={styles.content}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>{trip.title}</Text>

            <View style={styles.statsRow}>
              <View style={[styles.statCell, styles.statBorderRight, { borderRightColor: colors.border }]}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Dates</Text>
                <View style={styles.dateRow}>
                  <DateChip month={dates.startMonth} day={dates.startDay} colors={colors} />
                  {dates.endMonth && dates.endDay && <DateChip month={dates.endMonth} day={dates.endDay} colors={colors} />}
                </View>
              </View>
              <View style={[styles.statCell, styles.statBorderRight, { borderRightColor: colors.border }]}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Budget</Text>
                <Text style={[styles.budgetValue, { color: colors.textPrimary }]}>₹ {trip.budget?.toLocaleString('en-IN') || '0'}</Text>
              </View>
              <View style={styles.statCell}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Seats Available</Text>
                <Text style={[styles.statValueLg, { color: colors.textPrimary }]}>{trip.max_travellers - trip.confirmed_travellers}</Text>
              </View>
            </View>

            <View style={[styles.interestBanner, { backgroundColor: colors.dim }]}>
              <View style={styles.interestBannerLeft}>
                <Text style={[styles.interestBannerTitle, { color: colors.textPrimary }]}>To join discussion forum and get updates</Text>
                {interestedCount > 0 && (
                  <View style={styles.interestCountRow}>
                    <View style={[styles.interestDot, { backgroundColor: colors.secondary }]} />
                    <Text style={[styles.interestCountText, { color: colors.secondary }]}>{interestedCount} People are interested</Text>
                  </View>
                )}
              </View>
              <TouchableOpacity
                style={[styles.interestBtn, { backgroundColor: interested ? colors.secondary : colors.primary }]}
                onPress={handleToggleInterest}
              >
                <Text style={[styles.interestBtnText, { color: colors.background }]}>Interested</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.organizerCard}>
              <View style={styles.organizerLeft}>
                {trip.organizer?.profile_pic ? (
                  <Image source={{ uri: trip.organizer.profile_pic }} style={styles.organizerAvatar} />
                ) : (
                  <View style={[styles.organizerAvatar, { backgroundColor: colors.ternary, justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={[styles.organizerInitial, { color: colors.primary }]}>{trip.organizer?.name?.[0]?.toUpperCase() || 'O'}</Text>
                  </View>
                )}
                <View style={styles.organizerInfo}>
                  <View style={styles.organizerNameRow}>
                    <Text style={[styles.organizerRoleLabel, { color: colors.textSecondary }]}>{trip.organizer?.name}</Text>
                    <BadgeCheck color={colors.secondary} size={16} />
                  </View>
                  {totalReviews >= 1 && (
                    <View style={styles.organizerStatsRow}>
                      <Star color="#F59E0B" fill="#F59E0B" size={13} />
                      <Text style={[styles.organizerRating, { color: colors.textPrimary }]}>{trip.organizer?.average_rating ?? '4.8'}</Text>
                      <Text style={[styles.organizerReviews, { color: colors.textSecondary }]}>( {totalReviews} Reviews )</Text>
                    </View>
                  )}
                </View>
              </View>
              <TouchableOpacity
                style={[styles.viewProfileBtn, { borderColor: colors.primary }]}
                onPress={() => navigation.navigate('OrganizerPublicProfile', { organizerId: trip.organizer?.organizer_id })}
              >
                <Text style={[styles.viewProfileText, { color: colors.primary }]}>View Profile</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.routeMapContainer}>
              {(
                <View style={[styles.routeMapPlaceholder, { backgroundColor: colors.dim }]} />
              )}

              {routeStops.length > 0 && (
                <TouchableOpacity
                  style={[styles.viewItineraryBtn, { backgroundColor: colors.background }]}
                  onPress={() => setItineraryModalVisible(true)}
                  activeOpacity={0.85}
                >
                  <MapIcon color={colors.primary} size={14} />
                  <Text style={[styles.viewItineraryBtnText, { color: colors.primary }]}>View Itinerary</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={[styles.sectionBlock, { borderTopColor: colors.border }]}>
              <SectionHeading label="About this Journey" colors={colors} />
              <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>{trip.description || 'No description provided.'}</Text>
            </View>

            {trip.frequently_asked && trip.frequently_asked.length > 0 && (
              <View style={[styles.sectionBlock, { borderTopColor: colors.border }]}>
                <SectionHeading label="Frequently asked questions" colors={colors} />
                <View style={styles.faqList}>
                  {trip.frequently_asked.map((faq: any, i: number) => (
                    <FAQRow key={i} question={faq.question} answer={faq.answer} colors={colors} />
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>
      </Animated.ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <View style={styles.priceBlock}>
          <Text style={[styles.priceAmount, { color: colors.textPrimary }]}>₹{trip.confirmation_amount?.toLocaleString('en-IN') || trip.budget?.toLocaleString('en-IN') || '0'}</Text>
          <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>Pay to confirm the trip</Text>
        </View>
        <TouchableOpacity
          style={[styles.confirmBtn, { backgroundColor: colors.confirmation }]}
          onPress={() => navigation.navigate('ConfirmTrip', { tripId })}
        >
          <Text style={[styles.confirmBtnText, { color: colors.background }]}>Confirm Trip</Text>
          <ChevronLeft color={colors.background} size={20} style={{ transform: [{ rotate: '180deg' }] }} />
        </TouchableOpacity>
      </View>

      {/* Itinerary popup */}
      <Modal
        visible={itineraryModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setItineraryModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.background }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Itinerary</Text>
              <TouchableOpacity
                style={[styles.modalCloseBtn, { backgroundColor: colors.dim }]}
                onPress={() => setItineraryModalVisible(false)}
              >
                <X color={colors.textPrimary} size={18} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              {routeStops.map((stop: any, i: number) => (
                <View key={i} style={styles.itineraryItem}>
                  <View style={styles.itineraryTimelineCol}>
                    <View style={[styles.itineraryDot, { backgroundColor: colors.secondary }]} />
                    {i !== routeStops.length - 1 && <View style={[styles.itineraryLine, { backgroundColor: colors.border }]} />}
                  </View>
                  <View style={styles.itineraryContent}>
                    {stop.media ? (
                      <Image
                        source={{ uri: stop.media }}
                        style={styles.itineraryImage}
                        resizeMode="cover"
                      />
                    ) : null}
                  
                   <View style={{paddingHorizontal:SPACING.md}}>
                    <Text style={[styles.itineraryTime, { color: colors.textSecondary }]}>
                      {stop.time
                        ? new Date(stop.time).toLocaleString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : ''}
                    </Text>
                  
                    <Text
                      style={[
                        styles.itineraryStopTitle,
                        { color: colors.textPrimary },
                      ]}
                    >
                      {stop.title}
                    </Text>
                  
                    {stop.location?.name ? (
                      <Text
                        style={[
                          styles.itineraryLocationName,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {stop.location.name}
                      </Text>
                    ) : null}
                  </View>
                </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: TYPOGRAPHY.sizes.md, fontFamily: TYPOGRAPHY.fontFamily, marginBottom: SPACING.md },
  backButtonInline: { padding: SPACING.md, borderRadius: SHAPES.roundedSmall },
  backButtonText: { fontFamily: TYPOGRAPHY.fontFamilyBold },
  scrollContent: { paddingBottom: 100 },

  // ---- animated header ----
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
    height: HEADER_ROW_HEIGHT,
    gap: SPACING.sm,
  },
  headerIconWrap: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIconCircle: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  headerIconLayer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stickyTitle: { flex: 1, fontSize: TYPOGRAPHY.sizes.md, fontFamily: TYPOGRAPHY.fontFamilyBold },

  // ---- hero ----
  heroWrapper: { height: HERO_HEIGHT, position: 'relative' },
  heroSlide: { width: SCREEN_WIDTH, height: HERO_HEIGHT },
  heroImage: { width: '100%', height: '100%' },

  // ---- rounded content sheet over the hero ----
  contentSheet: {
    marginTop: -SHAPES.roundedLarge,
    borderTopLeftRadius: SHAPES.roundedLarge,
    borderTopRightRadius: SHAPES.roundedLarge,
    overflow: 'hidden',
    paddingTop: SPACING.xl,
  },
  content: { paddingHorizontal: SPACING.lg },
  title: { fontSize: TYPOGRAPHY.sizes.xl, fontFamily: TYPOGRAPHY.fontFamilyBold, marginBottom: SPACING.md, lineHeight: 30 },

  statsRow: { flexDirection: 'row', borderRadius: SHAPES.roundedMedium, marginBottom: SPACING.md, overflow: 'hidden' },
  statCell: { flex: 1, padding: SPACING.md, justifyContent: 'center', alignItems: 'center' },
  statBorderRight: { borderRightWidth: 1 },
  statLabel: { fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamily, marginBottom: 6, textAlign: 'center' },
  statValue: { fontSize: TYPOGRAPHY.sizes.sm, fontFamily: TYPOGRAPHY.fontFamilySemiBold },
  statValueLg: { fontSize: TYPOGRAPHY.sizes.xl, fontFamily: TYPOGRAPHY.fontFamilyBold },
  budgetValue: { fontSize: TYPOGRAPHY.sizes.lg, fontFamily: TYPOGRAPHY.fontFamilyBold },
  dateRow: { flexDirection: 'row', gap: 6, width: '100%' },
  dateChip: { flex: 1, borderRadius: SHAPES.roundedSmall, paddingHorizontal: SPACING.sm, paddingVertical: 2, alignItems: 'center' },
  dateChipMonth: { fontSize: 9, fontFamily: TYPOGRAPHY.fontFamilySemiBold },
  dateChipDay: { fontSize: TYPOGRAPHY.sizes.sm, fontFamily: TYPOGRAPHY.fontFamilyBold },

itineraryItem: {
  flexDirection: 'row',
  gap: SPACING.sm,
  alignItems: 'flex-start'
},

itineraryImage: {
  width: 50,
  height: 50,
  borderRadius: SHAPES.roundedMedium,
},
  interestBanner: { flexDirection: 'row', alignItems: 'center', borderRadius: SHAPES.roundedMedium, padding: SPACING.md, marginBottom: SPACING.md, gap: SPACING.md },
  interestBannerLeft: { flex: 1, gap: 4 },
  interestBannerTitle: { fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamilySemiBold },
  interestCountRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  interestDot: { width: 8, height: 8, borderRadius: 4 },
  interestCountText: { fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamily },
  interestBtn: { paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md, borderRadius: SHAPES.roundedSmall },
  interestBtnText: { fontFamily: TYPOGRAPHY.fontFamilyBold, fontSize: TYPOGRAPHY.sizes.sm },

  organizerCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.md },
  organizerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: SPACING.sm },
  organizerAvatar: { width: 52, height: 52, borderRadius: 26 },
  organizerInitial: { fontSize: TYPOGRAPHY.sizes.lg, fontFamily: TYPOGRAPHY.fontFamilyBold },
  organizerInfo: { flex: 1, gap: 3 },
  organizerNameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  organizerRoleLabel: { fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamilySemiBold },
  organizerStatsRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 3 },
  organizerRating: { fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamilyBold },
  organizerReviews: { fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamily },
  viewProfileBtn: { borderWidth: 1, borderRadius: SHAPES.roundedSmall, paddingVertical: SPACING.xs + 2, paddingHorizontal: SPACING.md },
  viewProfileText: { fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamilySemiBold },

  routeMapContainer: { width: '100%', height: 200, borderRadius: SHAPES.roundedLarge, marginBottom: SPACING.lg, overflow: 'hidden', position: 'relative' },
  routeMap: { width: '100%', height: '100%' },
  routeMapPlaceholder: { width: '100%', height: '100%' },
  viewItineraryBtn: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.sm,
    borderRadius: SHAPES.roundedSmall,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  viewItineraryBtnText: { fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamilySemiBold },
  routeLoadingPill: {
    position: 'absolute',
    bottom: SPACING.sm,
    left: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: SPACING.sm,
    borderRadius: SHAPES.roundedSmall,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  routeLoadingText: { fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamily },

  sectionBlock: { marginBottom: SPACING.lg, borderTopWidth: 1, paddingTop: SPACING.lg },
  sectionHeadingRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  sectionDot: { width: 10, height: 10, borderRadius: 5 },
  sectionHeadingText: { fontSize: TYPOGRAPHY.sizes.lg, fontFamily: TYPOGRAPHY.fontFamilyBold },
  descriptionText: { fontSize: TYPOGRAPHY.sizes.sm, fontFamily: TYPOGRAPHY.fontFamily, lineHeight: 22, textAlign: 'justify' },
  faqList: { gap: SPACING.sm },
  faqRow: { borderRadius: SHAPES.roundedMedium, padding: SPACING.md },
  faqHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  faqQuestion: { flex: 1, fontSize: TYPOGRAPHY.sizes.sm, fontFamily: TYPOGRAPHY.fontFamily, paddingRight: SPACING.sm },
  faqAnswer: { marginTop: SPACING.sm, fontSize: TYPOGRAPHY.sizes.sm, fontFamily: TYPOGRAPHY.fontFamily, lineHeight: 20 },

  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  priceBlock: { gap: 2 },
  priceAmount: { fontSize: TYPOGRAPHY.sizes.xl, fontFamily: TYPOGRAPHY.fontFamilyBold },
  priceLabel: { fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamily },
  confirmBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg, borderRadius: SHAPES.roundedMedium },
  confirmBtnText: { fontFamily: TYPOGRAPHY.fontFamilyBold, fontSize: TYPOGRAPHY.sizes.md },

  // ---- itinerary popup ----
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalCard: {
    maxHeight: '75%',
    borderTopLeftRadius: SHAPES.roundedLarge,
    borderTopRightRadius: SHAPES.roundedLarge,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    marginBottom: SPACING.md,
  },
  modalTitle: { fontSize: TYPOGRAPHY.sizes.lg, fontFamily: TYPOGRAPHY.fontFamilyBold },
  modalCloseBtn: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  modalScroll: { paddingHorizontal: SPACING.lg },
  itineraryTimelineCol: { alignItems: 'center', width: 16 },
  itineraryDot: { width: 10, height: 10, borderRadius: 5, marginTop: 4 },
  itineraryLine: { flex: 1, width: 2, marginTop: 2, marginBottom: 2 },
  itineraryContent: { flex: 1, flexDirection: 'row', paddingBottom: SPACING.lg },
  itineraryTime: { fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamily, marginBottom: 2 },
  itineraryStopTitle: { fontSize: TYPOGRAPHY.sizes.sm, fontFamily: TYPOGRAPHY.fontFamilySemiBold, marginBottom: 2 },
  itineraryLocationName: { fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamily },
});