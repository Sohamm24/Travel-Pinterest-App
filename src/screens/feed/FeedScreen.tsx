import React, { useCallback } from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../context/ThemeContext';
import { useFeed } from '../../hooks/useFeed';
import ImageCard from '../../components/ImageCard';
import LoadingIndicator from '../../components/LoadingIndicator';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';
import type { ImageResult } from '../../types/api';
import type { RootStackParamList } from '../../navigation/RootNavigator';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Feed'>;
};

export default function FeedScreen({ navigation }: Props): React.JSX.Element {
  const { colors } = useTheme();
  const {
    images,
    loading,
    refreshing,
    hasMore,
    error,
    loadMore,
    refresh,
    recordView,
    recordLongPress,
  } = useFeed();

  const renderItem = useCallback(
    ({ item }: { item: ImageResult }) => (
      <View style={styles.gridItem}>
        <ImageCard
          image={item}
          onPress={() => recordView(item.id)}
          onLongPress={() => recordLongPress(item.id)}
        />
      </View>
    ),
    [recordView, recordLongPress],
  );

  const keyExtractor = useCallback((item: ImageResult) => item.id, []);

  const ListEmpty = !loading ? (
    <View style={styles.emptyWrapper}>
      {error ? (
        <>
          <Text style={styles.emptyIcon}>⚡</Text>
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
            Couldn't load feed
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            {error}
          </Text>
        </>
      ) : (
        <>
          <Text style={styles.emptyIcon}>🌐</Text>
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
            No photos yet
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Pull down to refresh
          </Text>
        </>
      )}
    </View>
  ) : null;

  const ListFooter =
    loading && images.length > 0 ? (
      <LoadingIndicator variant="spinner" />
    ) : null;

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background }]}
    >
      {/* Initial skeleton */}
      {loading && images.length === 0 ? (
        <LoadingIndicator variant="skeleton" count={3} />
      ) : (
        <FlatList
          data={images}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.list}
          ListEmptyComponent={ListEmpty}
          ListFooterComponent={ListFooter}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          removeClippedSubviews
          maxToRenderPerBatch={5}
          updateCellsBatchingPeriod={50}
          windowSize={10}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  list: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxxl,
    paddingHorizontal: spacing.screenPadding / 2,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginHorizontal: spacing.screenPadding / 2,
  },
  gridItem: {
    flex: 1,
    marginHorizontal: spacing.screenPadding / 2,
    marginBottom: spacing.md,
  },
  listHeader: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: spacing.md,
  },
  tagline: {
    fontSize: typography.sm,
    fontWeight: typography.medium,
    letterSpacing: 0.2,
  },
  emptyWrapper: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 80,
    gap: spacing.sm,
  },
  emptyIcon: { fontSize: 40 },
  emptyTitle: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
  },
  emptySubtitle: {
    fontSize: typography.base,
    textAlign: 'center',
    paddingHorizontal: spacing.xxl,
  },
});