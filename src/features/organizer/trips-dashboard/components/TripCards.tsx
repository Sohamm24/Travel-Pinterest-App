import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Calendar, Users } from 'lucide-react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { TYPOGRAPHY, SHAPES, SPACING } from '../../../../constants/theme';
import type { OrganizerTrip } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function formatDateRange(startDate?: string, endDate?: string) {
  const fmt = (d: string) => {
    const date = new Date(d);
    return {
      day: date.getDate().toString(),
      month: date.toLocaleString('default', { month: 'short' }),
    };
  };
  const start = startDate ? fmt(startDate) : null;
  const end = endDate ? fmt(endDate) : null;
  return { start, end };
}

export default function TripCards({ trip, onPress }: { trip: OrganizerTrip; onPress: () => void }) {
  const { colors } = useTheme();
  
  const firstItineraryDate = new Date(trip.itinerary[0].time);
  const lastItineraryDate = new Date(trip.itinerary[trip.itinerary.length - 1].time);

  const dates = {
    startMonth: firstItineraryDate?.toLocaleString('default', { month: 'short' }) ?? '',
    startDay: firstItineraryDate?.getDate().toString() ?? '',
    endMonth: lastItineraryDate?.toLocaleString('default', { month: 'short' }) ?? '',
    endDay: lastItineraryDate?.getDate().toString() ?? '',
  };


  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.cardLeft}>
        <Text style={[styles.tripTitle, { color: colors.textPrimary }]} numberOfLines={3}>
          {trip.title}
        </Text>

    
        <View style={styles.infoRow}>
          <Calendar color={colors.iconDisabled} size={14} />
          <Text style={[styles.infoText, { color: colors.iconDisabled }]}>
            {dates.startDay} {dates.startMonth} - {dates.endDay} {dates.endMonth}
          </Text>
        </View>

        {trip.confirmed_travellers !== undefined && trip.max_travellers !== undefined && (
          <View style={styles.infoRow}>
            <Users color={colors.textPrimary} size={14} />
            <Text style={[styles.infoText, { color: colors.textPrimary }]}>
              {trip.confirmed_travellers}/{trip.max_travellers} confirmed
            </Text>
          </View>
        )}
      </View>

      <View style={styles.cardRight}>
        {trip.thumbnail ? (
          <Image source={{ uri: trip.thumbnail }} style={styles.coverImage} />
        ) : (
          <View style={[styles.coverImage, { backgroundColor: colors.ternary }]} />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    borderRadius: SHAPES.roundedLarge,
    overflow: 'hidden',
    borderWidth: 1,
    maxHeight: 150,
  },
  cardLeft: {
    flex: 1,
    padding: SPACING.md,
    justifyContent: 'center',
  },
  tripTitle: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontFamily: TYPOGRAPHY.fontFamilyBold,
    marginBottom: SPACING.sm,
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  infoText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontFamily: TYPOGRAPHY.fontFamily,
  },
  fromText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontFamily: TYPOGRAPHY.fontFamily,
    marginTop: 4,
  },
  cardRight: {
    width: SCREEN_WIDTH * 0.38,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
});