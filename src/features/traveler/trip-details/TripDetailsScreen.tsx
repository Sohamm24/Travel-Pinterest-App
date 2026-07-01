import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Share,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../context/ThemeContext';
import { TYPOGRAPHY, SHAPES, SPACING } from '../../../constants/theme';
import {
  ChevronLeft,
  Bookmark,
  Share2,
  PersonStanding,
  Plus,
  Minus,
  BadgeCheck,
  Star,
} from 'lucide-react-native';
import { useTripDetails, useToggleInterest } from './hooks';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HERO_HEIGHT = 300;

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

export default function TripDetailsScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { tripId } = route.params;

  const { data: trip, isLoading } = useTripDetails(tripId);
  const toggleInterestMutation = useToggleInterest(tripId);

  const [bookmarked, setBookmarked] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const interested = trip?.is_interested ?? false;

  const handleToggleInterest = () => {
    toggleInterestMutation.mutate(interested);
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: `Check out this trip: ${trip?.title}` });
    } catch {}
  };

  const onCarouselScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveSlide(idx);
  };

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
  if (trip?.cover_image) slides.push(trip.cover_image);
  trip?.itinerary?.forEach((day: any) =>
    day.activities?.forEach((act: any) => {
      if (act.image) slides.push(act.image);
    })
  );
  if (slides.length === 0) slides.push('');

  const dates = formatDateRange(trip.start_date, trip.end_date);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.stickyHeader, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.headerIconBtn} onPress={() => navigation.goBack()}>
          <ChevronLeft color={colors.textPrimary} size={22} />
        </TouchableOpacity>
        <Text style={[styles.stickyTitle, { color: colors.textPrimary }]} numberOfLines={1}>{trip.title}</Text>
        <TouchableOpacity style={styles.headerIconBtn} onPress={() => setBookmarked((b) => !b)}>
          <Bookmark color={bookmarked ? colors.primary : colors.textPrimary} fill={bookmarked ? colors.primary : 'transparent'} size={20} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerIconBtn} onPress={handleShare}>
          <Share2 color={colors.textPrimary} size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.heroWrapper, { backgroundColor: colors.surface }]}>
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} onMomentumScrollEnd={onCarouselScroll} scrollEventThrottle={16}>
            {slides.map((uri, i) => (
              <View key={i} style={styles.heroSlide}>
                {uri ? <Image source={{ uri }} style={styles.heroImage} /> : <View style={[styles.heroImage, { backgroundColor: colors.ternary }]} />}
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.heroBackBtn} onPress={() => navigation.goBack()}>
            <ChevronLeft color="#fff" size={22} />
          </TouchableOpacity>
          <View style={styles.heroTopRight}>
            <TouchableOpacity style={styles.heroCircleBtn} onPress={() => setBookmarked((b) => !b)}>
              <Bookmark color="#fff" fill={bookmarked ? '#fff' : 'transparent'} size={18} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.heroCircleBtn} onPress={handleShare}>
              <Share2 color="#fff" size={18} />
            </TouchableOpacity>
          </View>
          <View style={styles.heroBottomOverlay}>
            <View />
            <TouchableOpacity
              style={[styles.viewItineraryBtn, { backgroundColor: colors.background }]}
              onPress={() => navigation.navigate('ViewItinerary', { tripId })}
            >
              <PersonStanding color={colors.textPrimary} size={16} />
              <Text style={[styles.viewItineraryText, { color: colors.textPrimary }]}>View Itinerary</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.dotsRow}>
          {slides.map((_, i) => (
            <View key={i} style={[styles.dot, { backgroundColor: colors.border }, i === activeSlide && { backgroundColor: colors.primary, width: 10, height: 10, borderRadius: 5 }]} />
          ))}
        </View>

        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>{trip.title}</Text>

          <View style={[styles.statsRow, { borderColor: colors.border }]}>
            <View style={[styles.statCell, styles.statBorderRight, { borderRightColor: colors.border }]}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Dates</Text>
              {dates ? (
                <View style={styles.dateRow}>
                  <DateChip month={dates.startMonth} day={dates.startDay} colors={colors} />
                  {dates.endMonth && dates.endDay && <DateChip month={dates.endMonth} day={dates.endDay} colors={colors} />}
                </View>
              ) : (
                <Text style={[styles.statValue, { color: colors.textPrimary }]}>TBD</Text>
              )}
            </View>
            <View style={[styles.statCell, styles.statBorderRight, { borderRightColor: colors.border, alignItems: 'center' }]}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Budget</Text>
              <Text style={[styles.budgetValue, { color: colors.textPrimary }]}>₹ {trip.budget?.toLocaleString('en-IN') || '0'}</Text>
            </View>
            <View style={[styles.statCell, { alignItems: 'center' }]}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Seats Filled</Text>
              <Text style={[styles.statValueLg, { color: colors.textPrimary }]}>{trip.confirmed_travellers ?? 0}/{trip.max_travellers ?? '?'}</Text>
            </View>
          </View>

          <View style={[styles.interestBanner, { backgroundColor: colors.dim }]}>
            <View style={styles.interestBannerLeft}>
              <Text style={[styles.interestBannerTitle, { color: colors.textPrimary }]}>To join discussion forum and get updates</Text>
              <View style={styles.interestCountRow}>
                <View style={[styles.interestDot, { backgroundColor: colors.secondary }]} />
                <Text style={[styles.interestCountText, { color: colors.secondary }]}>{trip.interested_count ?? 0} People are interested</Text>
              </View>
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
                  <Text style={[styles.organizerRoleLabel, { color: colors.textSecondary }]}>Trip Organizer</Text>
                  <BadgeCheck color={colors.secondary} size={16} />
                </View>
                <View style={styles.organizerStatsRow}>
                  <Star color="#F59E0B" fill="#F59E0B" size={13} />
                  <Text style={[styles.organizerRating, { color: colors.textPrimary }]}>{trip.organizer?.average_rating ?? '4.8'}</Text>
                  <Text style={[styles.organizerReviews, { color: colors.textSecondary }]}>( {trip.organizer?.total_reviews ?? 0} Reviews )</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.viewProfileBtn, { borderColor: colors.primary }]}
              onPress={() => navigation.navigate('OrganizerPublicProfile', { organizerId: trip.organizer?.id })}
            >
              <Text style={[styles.viewProfileText, { color: colors.primary }]}>View Profile</Text>
            </TouchableOpacity>
          </View>

          {trip.route_map_image ? (
            <Image source={{ uri: trip.route_map_image }} style={styles.routeMap} resizeMode="cover" />
          ) : (
            <View style={[styles.routeMapPlaceholder, { backgroundColor: colors.dim }]} />
          )}

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
      </ScrollView>

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
  stickyHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingTop: SPACING.xl + 10, paddingBottom: SPACING.sm, borderBottomWidth: 1, gap: SPACING.sm, zIndex: 10 },
  headerIconBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  stickyTitle: { flex: 1, fontSize: TYPOGRAPHY.sizes.md, fontFamily: TYPOGRAPHY.fontFamilyBold },
  heroWrapper: { height: HERO_HEIGHT, position: 'relative' },
  heroSlide: { width: SCREEN_WIDTH, height: HERO_HEIGHT },
  heroImage: { width: '100%', height: '100%' },
  heroBackBtn: { position: 'absolute', top: SPACING.lg, left: SPACING.md, width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', alignItems: 'center' },
  heroTopRight: { position: 'absolute', top: SPACING.lg, right: SPACING.md, flexDirection: 'row', gap: SPACING.sm },
  heroCircleBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', alignItems: 'center' },
  heroBottomOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingBottom: SPACING.md, paddingTop: SPACING.xl },
  viewItineraryBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: SPACING.xs + 2, paddingHorizontal: SPACING.md, borderRadius: SHAPES.roundedFull },
  viewItineraryText: { fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamilySemiBold },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, paddingVertical: SPACING.md },
  dot: { width: 8, height: 8, borderRadius: 4 },
  content: { paddingHorizontal: SPACING.lg },
  title: { fontSize: TYPOGRAPHY.sizes.xl, fontFamily: TYPOGRAPHY.fontFamilyBold, marginBottom: SPACING.md, lineHeight: 30 },
  statsRow: { flexDirection: 'row', borderWidth: 1, borderRadius: SHAPES.roundedMedium, marginBottom: SPACING.md, overflow: 'hidden' },
  statCell: { flex: 1, padding: SPACING.md, justifyContent: 'center' },
  statBorderRight: { borderRightWidth: 1 },
  statLabel: { fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamily, marginBottom: 6 },
  statValue: { fontSize: TYPOGRAPHY.sizes.sm, fontFamily: TYPOGRAPHY.fontFamilySemiBold },
  statValueLg: { fontSize: TYPOGRAPHY.sizes.xl, fontFamily: TYPOGRAPHY.fontFamilyBold },
  budgetValue: { fontSize: TYPOGRAPHY.sizes.lg, fontFamily: TYPOGRAPHY.fontFamilyBold },
  dateRow: { flexDirection: 'row', gap: 6 },
  dateChip: { borderRadius: SHAPES.roundedSmall, paddingHorizontal: SPACING.sm, paddingVertical: 2, alignItems: 'center' },
  dateChipMonth: { fontSize: 9, fontFamily: TYPOGRAPHY.fontFamilySemiBold },
  dateChipDay: { fontSize: TYPOGRAPHY.sizes.sm, fontFamily: TYPOGRAPHY.fontFamilyBold },
  interestBanner: { flexDirection: 'row', alignItems: 'center', borderRadius: SHAPES.roundedMedium, padding: SPACING.md, marginBottom: SPACING.md, gap: SPACING.md },
  interestBannerLeft: { flex: 1, gap: 4 },
  interestBannerTitle: { fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamilySemiBold },
  interestCountRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  interestDot: { width: 8, height: 8, borderRadius: 4 },
  interestCountText: { fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamily },
  interestBtn: { paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md, borderRadius: SHAPES.roundedMedium },
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
  viewProfileBtn: { borderWidth: 1, borderRadius: SHAPES.roundedMedium, paddingVertical: SPACING.xs + 2, paddingHorizontal: SPACING.md },
  viewProfileText: { fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamilySemiBold },
  routeMap: { width: '100%', height: 200, borderRadius: SHAPES.roundedLarge, marginBottom: SPACING.lg },
  routeMapPlaceholder: { width: '100%', height: 200, borderRadius: SHAPES.roundedLarge, marginBottom: SPACING.lg },
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
});
