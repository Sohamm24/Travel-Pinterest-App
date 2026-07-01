import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { TYPOGRAPHY, SHAPES, SPACING } from '../../../../constants/theme';
import TripCard from '../../home/components/TripCard';
import type { TripResponse } from '../types';

interface OrganizerTripCardsProps {
  trips: TripResponse[];
  isLoading: boolean;
  isFetchingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onTripPress: (tripId: string) => void;
  ListHeaderComponent?: React.ReactElement;
}

export default function OrganizerTripCards({
  trips,
  isLoading,
  isFetchingMore,
  hasMore,
  onLoadMore,
  onTripPress,
  ListHeaderComponent,
}: OrganizerTripCardsProps) {
  const { colors } = useTheme();

  return (
    <FlatList
      data={trips}
      keyExtractor={(item) => item.trip_id}
      renderItem={({ item }) => (
        <TripCard item={item} onPress={() => onTripPress(item.trip_id)} />
      )}
      ListHeaderComponent={ListHeaderComponent}
      contentContainerStyle={styles.listContent}
      onEndReached={() => hasMore && !isLoading && onLoadMore()}
      onEndReachedThreshold={0.5}
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
              This organizer hasn't posted any trips yet.
            </Text>
          </View>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: SPACING.xl,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: SPACING.xl * 2,
  },
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
