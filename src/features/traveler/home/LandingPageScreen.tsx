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
  Image,
  Animated,
  Easing
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

const HERO_SLIDES = [
  {
    headline: 'BETTER JOURNEYS\nSTART WITH…',
    features: [
      { icon: ShieldCheck, label: 'Trusted Hosts' },
      { icon: Users, label: 'Travel Safely' },
      { icon: PiggyBank, label: 'Save More' },
      { icon: ClipboardList, label: 'Hassle-Free\nPlanning' },
    ],
  },
  {
    headline: 'EXPLORE THE\nUNEXPLORED',
    features: [
      { icon: ShieldCheck , label: 'Verified Trips' },
      { icon: Users , label: 'Community Led' },
      { icon: PiggyBank , label: 'Best Prices' },
      { icon: ClipboardList , label: 'Easy Booking' },
    ],
  },
];

const CATEGORIES = [
  { key: 'all', label: 'Travel (All)', image: require('../../../../assets/all.jpeg') },
  { key: 'beach', label: 'Beach', image: require('../../../../assets/beach.jpeg') },
  { key: 'hill', label: 'Hill Station', image: require('../../../../assets/hill-station.jpeg') },
  { key: 'city', label: 'City tour', image: require('../../../../assets/cities.jpeg') },
  { key: 'camping', label: 'Camping', image: require('../../../../assets/camping.jpeg') },
  { key: 'trek', label: 'Trekking', image: require('../../../../assets/trekking.jpeg') },
  { key: 'heritage', label: 'Heritage', image: require('../../../../assets/spiritual.jpeg') },
  { key: 'star-gazing', label: 'Star Gazing', image: require('../../../../assets/star-gazing.jpeg') },
];

function HeroBanner() {
  const scrollRef = useRef<ScrollView>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const { colors } = useTheme();

  // Background bubbles are static

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

  // Static bubble styling is inline below

  return (
    <View style={[heroStyles.wrapper, { backgroundColor: colors.banner }]}>
      <View
        pointerEvents="none"
        style={[
          heroStyles.bubbleTopLeft,
          { backgroundColor: colors.ternary, opacity: 0.4, transform: [{ scale: 1.0 }] },
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          heroStyles.bubbleBottomRight,
          { backgroundColor: colors.ternary, opacity: 0.4, transform: [{ scale: 1.0 }] },
        ]}
      />

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
            <Text style={[heroStyles.headline, { color: colors.bannerText }]}>
              {slide.headline}
            </Text>
            <View style={heroStyles.featuresRow}>
              {slide.features.map((f, fi) => {
                const Icon = f.icon;
              
                return (
                  <React.Fragment key={fi}>
                    {fi > 0 && (
                      <View
                        style={[
                          heroStyles.featureDivider,
                          { backgroundColor: colors.textPrimary },
                        ]}
                      />
                    )}
              
                    <View style={heroStyles.featureItem}>
                      <Icon color={colors.textPrimary} size={22} />
                      <Text
                        style={[
                          heroStyles.featureLabel,
                          { color: colors.textPrimary },
                        ]}
                      >
                        {f.label}
                      </Text>
                    </View>
                  </React.Fragment>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={heroStyles.dots}>
        {HERO_SLIDES.map((_, i) => (
          <View
            key={i}
            style={[
              heroStyles.dot,
              { backgroundColor: colors.primaryDim },
              i === activeSlide && [
                heroStyles.dotActive,
                { backgroundColor: colors.secondary },
              ],
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const heroStyles = StyleSheet.create({
  wrapper: {
    paddingBottom: SPACING.lg,
  },
  bubbleTopLeft: {
    position: 'absolute',
    top: -30,
    left: -30,
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  bubbleBottomRight: {
    position: 'absolute',
    bottom: -30,
    right: -30,
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  slide: {
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
    textAlign: 'center',
    lineHeight: 13,
  },
  featureDivider: {
    width: 1,
    height: 40,
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
  },
  dotActive: {
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
  const TILE_SIZE = 90;
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
                    { width: TILE_SIZE, height: TILE_SIZE },
                    isActive && { borderWidth: 2, borderColor: colors.secondary },
                  ]}
                >
                  <Image
                    source={cat.image}
                    resizeMode="contain"
                  />
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
    overflow: 'hidden',
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
      <View style={[styles.topBar, { backgroundColor: colors.banner }]}>
        <Image 
                 source={require('../../../../assets/logo-header.png')} 
                 style={styles.logo} 
                 resizeMode='contain'
                 />
      </View>

      <HeroBanner/>
      <CategoryGrid activeCategory={activeCategory} onSelect={handleCategorySelect} colors={colors} />

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
  logo: { width: 80, height: 80,},
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
    paddingTop: SPACING.lg,
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