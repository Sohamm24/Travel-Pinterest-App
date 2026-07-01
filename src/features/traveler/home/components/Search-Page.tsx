import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Search, MapPin, TrendingUp } from 'lucide-react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { TYPOGRAPHY, SHAPES, SPACING } from '../../../../constants/theme';
import { api } from '../../../../services/api';

const POPULAR_CITIES = [
  { name: 'Ladakh', emoji: '🏔️' },
  { name: 'Goa', emoji: '🏖️' },
  { name: 'Manali', emoji: '⛰️' },
  { name: 'Rishikesh', emoji: '🧘' },
  { name: 'Jaipur', emoji: '🏛️' },
  { name: 'Kerala', emoji: '🌴' },
  { name: 'Meghalaya', emoji: '🌧️' },
  { name: 'Spiti Valley', emoji: '🏔️' },
];

export default function SearchPage() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const data = await api.searchTrips(query.trim());
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCityPress = (city: string) => {
    setQuery(city);
    setLoading(true);
    setSearched(true);
    api.searchTrips(city).then(setResults).catch(() => setResults([])).finally(() => setLoading(false));
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color={colors.textPrimary} size={24} />
        </TouchableOpacity>
        <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Search color={colors.textSecondary} size={16} />
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
            placeholder="Search trips, destinations..."
            placeholderTextColor={colors.textSecondary}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoFocus
          />
        </View>
      </View>

      {!searched ? (
        <View style={styles.content}>
          <View style={styles.sectionRow}>
            <TrendingUp color={colors.secondary} size={16} />
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Popular Destinations
            </Text>
          </View>
          <View style={styles.cityGrid}>
            {POPULAR_CITIES.map((city) => (
              <TouchableOpacity
                key={city.name}
                style={[styles.cityChip, { backgroundColor: colors.dim }]}
                onPress={() => handleCityPress(city.name)}
              >
                <Text style={styles.cityEmoji}>{city.emoji}</Text>
                <Text style={[styles.cityName, { color: colors.textPrimary }]}>{city.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.trip_id || String(Math.random())}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.resultCard, { borderBottomColor: colors.border }]}
              onPress={() => navigation.navigate('TripDetails', { tripId: item.trip_id })}
            >
              <MapPin color={colors.secondary} size={16} />
              <View style={styles.resultInfo}>
                <Text style={[styles.resultTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={[styles.resultSub, { color: colors.textSecondary }]} numberOfLines={1}>
                  {item.location?.name || 'Unknown location'}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.centerBox}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No trips found for "{query}"
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xl + 10,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    gap: SPACING.sm,
  },
  backBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: SHAPES.roundedSmall,
    borderWidth: 1,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: TYPOGRAPHY.sizes.md,
    fontFamily: TYPOGRAPHY.fontFamily,
    padding: 0,
  },
  content: { padding: SPACING.lg },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontFamily: TYPOGRAPHY.fontFamilyBold,
  },
  cityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  cityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.md,
    borderRadius: SHAPES.roundedMedium,
  },
  cityEmoji: { fontSize: 18 },
  cityName: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.fontFamilySemiBold,
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: SPACING.xl * 3,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontFamily: TYPOGRAPHY.fontFamily,
  },
  listContent: { paddingBottom: SPACING.xl },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
  resultInfo: { flex: 1 },
  resultTitle: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontFamily: TYPOGRAPHY.fontFamilySemiBold,
    marginBottom: 2,
  },
  resultSub: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.fontFamily,
  },
});