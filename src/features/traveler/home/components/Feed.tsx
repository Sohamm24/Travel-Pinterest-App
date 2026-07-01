import React from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { TYPOGRAPHY, SPACING } from '../../../../constants/theme';
import TripCard from './TripCard';
import type { TripResponse } from '../types';

interface FeedProps {
  trips: TripResponse[];
  isLoading: boolean;
  isFetchingMore: boolean;
  isRefreshing: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onRefresh: () => void;
  onTripPress: (tripId: string) => void;
  ListHeaderComponent?: React.ReactElement;
}

export default function Feed({
  trips,
  isLoading,
  isFetchingMore,
  isRefreshing,
  hasMore,
  onLoadMore,
  onRefresh,
  onTripPress,
  ListHeaderComponent,
}: FeedProps) {
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
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
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
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: SPACING.xl,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: SPACING.xl * 3,
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
