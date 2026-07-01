import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Star } from 'lucide-react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { TYPOGRAPHY, SHAPES, SPACING } from '../../../../constants/theme';

const DUMMY_REVIEWS = [
  { id: '1', trip: 'Manali Winter Trek', organizer: 'Rohan Adventures', rating: 5, comment: 'Absolutely incredible experience! Rohan was a fantastic organizer and the itinerary was perfectly paced. Would do it again in a heartbeat.', date: 'Dec 2024' },
  { id: '2', trip: 'Rajasthan Heritage Tour', organizer: 'Desert Wanderers', rating: 4, comment: 'Great trip overall. The forts and palaces were breathtaking. A few logistics could have been smoother, but the overall experience was memorable.', date: 'Oct 2024' },
  { id: '3', trip: 'Kerala Backwaters', organizer: 'South Wave Trips', rating: 5, comment: 'The houseboat stay was magical. Woke up to misty backwaters and fresh coconut water. Perfect relaxation trip.', date: 'Aug 2024' },
];

function StarRating({ rating, colors }: { rating: number; colors: any }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={14}
          color="#F59E0B"
          fill={i <= rating ? '#F59E0B' : 'transparent'}
        />
      ))}
    </View>
  );
}

function ReviewCard({ item, colors }: { item: typeof DUMMY_REVIEWS[0]; colors: any }) {
  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.tripName, { color: colors.textPrimary }]}>{item.trip}</Text>
          <Text style={[styles.organizerName, { color: colors.textSecondary }]}>with {item.organizer}</Text>
        </View>
        <View style={styles.ratingCol}>
          <StarRating rating={item.rating} colors={colors} />
          <Text style={[styles.dateText, { color: colors.textSecondary }]}>{item.date}</Text>
        </View>
      </View>
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      <Text style={[styles.comment, { color: colors.textPrimary }]}>{item.comment}</Text>
    </View>
  );
}

export default function Reviews() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color={colors.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Your Reviews</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.summaryNumber, { color: colors.primary }]}>4.7</Text>
          <StarRating rating={5} colors={colors} />
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Average rating across {DUMMY_REVIEWS.length} trips</Text>
        </View>

        {DUMMY_REVIEWS.map((review) => (
          <ReviewCard key={review.id} item={review} colors={colors} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingTop: SPACING.xl + 10, paddingBottom: SPACING.sm, borderBottomWidth: 1 },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: TYPOGRAPHY.sizes.lg, fontFamily: TYPOGRAPHY.fontFamilyBold },
  content: { padding: SPACING.md, gap: SPACING.md, paddingBottom: 60 },
  summaryCard: { borderRadius: SHAPES.roundedMedium, padding: SPACING.xl, alignItems: 'center', gap: SPACING.sm },
  summaryNumber: { fontSize: 48, fontFamily: TYPOGRAPHY.fontFamilyBold },
  summaryLabel: { fontSize: TYPOGRAPHY.sizes.sm, fontFamily: TYPOGRAPHY.fontFamily, textAlign: 'center' },
  card: { borderRadius: SHAPES.roundedMedium, padding: SPACING.md, gap: SPACING.sm },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  tripName: { fontSize: TYPOGRAPHY.sizes.md, fontFamily: TYPOGRAPHY.fontFamilySemiBold },
  organizerName: { fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamily, marginTop: 2 },
  ratingCol: { alignItems: 'flex-end', gap: 4 },
  dateText: { fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamily },
  divider: { height: 1 },
  comment: { fontSize: TYPOGRAPHY.sizes.sm, fontFamily: TYPOGRAPHY.fontFamily, lineHeight: 22 },
});
