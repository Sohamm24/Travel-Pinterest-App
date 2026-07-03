import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Dimensions,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../context/ThemeContext';
import { TYPOGRAPHY, SHAPES, SPACING, COLORS } from '../../../constants/theme';
import {
  Search,
  ChevronDown,
  ShieldCheck,
  Users,
  PiggyBank,
  ClipboardList,
} from 'lucide-react-native';
import { useTrips } from './hooks';
import TripCard from './components/TripCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const FILTER_PILLS = ['10-15 days', 'Solo Friendly', 'Host Accomodation', 'Budget', 'Weekend'];

const HERO_SLIDES = [
  {
    headline: 'BETTER JOURNEYS\nSTART WITH…',
    features: [
      { icon: <ShieldCheck color="#fff" size={22} />, label: 'Trusted Hosts' },
      { icon: <Users color="#fff" size={22} />, label: 'Travel Safely' },
      { icon: <PiggyBank color="#fff" size={22} />, label: 'Save More' },
      { icon: <ClipboardList color="#fff" size={22} />, label: 'Hassle-Free\nPlanning' },
    ],
  },
  {
    headline: 'EXPLORE THE\nUNEXPLORED',
    features: [
      { icon: <ShieldCheck color="#fff" size={22} />, label: 'Verified Trips' },
      { icon: <Users color="#fff" size={22} />, label: 'Community Led' },
      { icon: <PiggyBank color="#fff" size={22} />, label: 'Best Prices' },
      { icon: <ClipboardList color="#fff" size={22} />, label: 'Easy Booking' },
    ],
  },
];

const CATEGORIES = [
  { key: 'all', label: 'Travel (All)', emoji: '🧭' },
  { key: 'beach', label: 'Beach', emoji: '🏖️' },
  { key: 'hill', label: 'Hill Station', emoji: '⛰️' },
  { key: 'trek', label: 'Trekking', emoji: '🥾' },
  { key: 'bike', label: 'Bike Riders', emoji: '🏍️' },
  { key: 'heritage', label: 'Heritage', emoji: '🏛️' },
  { key: 'safari', label: 'Safari', emoji: '🦒' },
  { key: 'city', label: 'City tour', emoji: '🌆' },
];

function HeroBanner({ colors }: { colors: any }) {
  const scrollRef = useRef<ScrollView>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const next = (activeSlide + 1) % HERO_SLIDES.length;
      scrollRef.current?.scrollTo({ x: next * SCREEN_WIDTH, animated: true });
      setActiveSlide(next);
    }, 3500);
    return () => clearInterval(timer);
  }, [activeSlide]);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveSlide(idx);
  };

  return (
    <View style={[heroStyles.wrapper, { backgroundColor: colors.primary }]}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        scrollEventThrottle={16}
      >
        {HERO_SLIDES.map((slide, i) => (
          <View key={i} style={[heroStyles.slide, { width: SCREEN_WIDTH }]}>
            <Text style={[heroStyles.headline, { color: COLORS.bannerText }]}>{slide.headline}</Text>
            <View style={heroStyles.featuresRow}>
              {slide.features.map((f, fi) => (
                <React.Fragment key={fi}>
                  {fi > 0 && <View style={heroStyles.featureDivider} />}
                  <View style={heroStyles.featureItem}>
                    {f.icon}
                    <Text style={heroStyles.featureLabel}>{f.label}</Text>
                  </View>
                </React.Fragment>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={heroStyles.dots}>
        {HERO_SLIDES.map((_, i) => (
          <View key={i} style={[heroStyles.dot, i === activeSlide && heroStyles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const heroStyles = StyleSheet.create({
  wrapper: { paddingBottom: SPACING.lg },
  slide: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    alignItems: 'center',
  },
  headline: {
    fontSize: TYPOGRAPHY.sizes.xxl - 2,
    fontFamily: TYPOGRAPHY.fontFamilyBold,
    textAlign: 'center',
    letterSpacing: 1,
    lineHeight: 38,
    marginBottom: SPACING.lg,
  },
  featuresRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  featureItem: {
    alignItems: 'center',
    width: (SCREEN_WIDTH - SPACING.lg * 2) / 4,
    gap: 6,
  },
  featureLabel: {
    fontSize: 10,
    fontFamily: TYPOGRAPHY.fontFamilySemiBold,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 13,
  },
  featureDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginTop: 4,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dotActive: {
    backgroundColor: '#fff',
    width: 20,
  },
});

function CategoryGrid({
  activeCategory,
  onSelect,
  colors,
}: {
  activeCategory: string | null;
  onSelect: (key: string) => void;
  colors: any;
}) {
  const TILE_SIZE = (SCREEN_WIDTH - SPACING.lg * 2 - SPACING.sm * 3) / 4;
  const rows = [CATEGORIES.slice(0, 4), CATEGORIES.slice(4, 8)];

  return (
    <View style={catStyles.grid}>
      {rows.map((row, ri) => (
        <View key={ri} style={catStyles.row}>
          {row.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <TouchableOpacity
                key={cat.key}
                style={catStyles.item}
                onPress={() => onSelect(cat.key)}
                activeOpacity={0.75}
              >
                <View
                  style={[
                    catStyles.tile,
                    { backgroundColor: colors.dim, width: TILE_SIZE, height: TILE_SIZE },
                    isActive && { borderWidth: 2, borderColor: colors.secondary },
                  ]}
                >
                  <Text style={{ fontSize: TILE_SIZE * 0.42 }}>{cat.emoji}</Text>
                </View>
                <Text
                  style={[
                    catStyles.label,
                    { color: isActive ? colors.secondary : colors.textSecondary },
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const catStyles = StyleSheet.create({
  grid: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    gap: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  item: {
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  tile: {
    borderRadius: SHAPES.roundedMedium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 10,
    fontFamily: TYPOGRAPHY.fontFamilySemiBold,
    textAlign: 'center',
  },
});

export default function LandingPageScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>('10-15 days');
  const [activeCategory, setActiveCategory] = useState<string | null>('all');

  const { trips, isLoading, isFetchingMore, isRefreshing, hasMore, loadMore, refresh } =
    useTrips(searchQuery || undefined);

  const handleCategorySelect = (key: string) => {
    setActiveCategory(activeCategory === key ? null : key);
  };

  const renderHeader = () => (
    <>
      <View style={[styles.topBar, { backgroundColor: colors.primary }]}>
        <Text style={[styles.logoText, { color: colors.secondary }]}>T</Text>
        <TouchableOpacity
          style={[styles.searchBar, { backgroundColor: colors.background }]}
          onPress={() => navigation.navigate('Search')}
          activeOpacity={0.8}
        >
          <Search color={colors.textSecondary} size={16} />
          <Text style={[styles.searchPlaceholder, { color: colors.textSecondary }]}>
            Find your next destination
          </Text>
        </TouchableOpacity>
      </View>

      <HeroBanner colors={colors} />
      <CategoryGrid activeCategory={activeCategory} onSelect={handleCategorySelect} colors={colors} />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
        style={styles.filterScroll}
      >
        <TouchableOpacity style={[styles.filterPill, { borderColor: colors.border, backgroundColor: colors.background }]}>
          <Text style={[styles.filterText, { color: colors.textSecondary }]}>Filters</Text>
          <ChevronDown color={colors.textSecondary} size={13} />
        </TouchableOpacity>

        {FILTER_PILLS.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.filterPill,
              { borderColor: colors.border, backgroundColor: colors.background },
              activeFilter === item && { backgroundColor: colors.secondary, borderColor: colors.secondary },
            ]}
            onPress={() => setActiveFilter(activeFilter === item ? null : item)}
          >
            <Text
              style={[
                styles.filterText,
                { color: colors.textSecondary },
                activeFilter === item && { color: colors.background },
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
        SHOWING TRIPS STARTING NEAR YOU
      </Text>
    </>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={trips}
        keyExtractor={(item) => item.trip_id}
        renderItem={({ item }) => (
          <TripCard
            item={item}
            onPress={() => navigation.navigate('TripDetails', { tripId: item.trip_id })}
          />
        )}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        onEndReached={() => hasMore && !isLoading && loadMore()}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => refresh()}
            colors={[colors.primary]}
          />
        }
        ListFooterComponent={
          isFetchingMore ? (
            <ActivityIndicator color={colors.primary} style={{ padding: SPACING.md }} />
          ) : null
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No trips found</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                Try a different search or check back later
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { paddingBottom: SPACING.xl },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl + 20,
    paddingBottom: SPACING.sm,
  },
  logoText: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontFamily: TYPOGRAPHY.fontFamilyBold,
    flexShrink: 0,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: SHAPES.roundedSmall,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  searchPlaceholder: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.fontFamily,
  },
  filterScroll: { marginTop: SPACING.md },
  filterRow: {
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.md,
    borderRadius: SHAPES.roundedFull,
    borderWidth: 1,
  },
  filterText: {
    fontFamily: TYPOGRAPHY.fontFamilySemiBold,
    fontSize: TYPOGRAPHY.sizes.xs,
  },
  sectionLabel: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontFamily: TYPOGRAPHY.fontFamilySemiBold,
    letterSpacing: 0.5,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.sm,
  },
  emptyContainer: { alignItems: 'center', paddingTop: SPACING.xl * 3 },
  emptyTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontFamily: TYPOGRAPHY.fontFamilyBold,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.fontFamily,
  },
});
