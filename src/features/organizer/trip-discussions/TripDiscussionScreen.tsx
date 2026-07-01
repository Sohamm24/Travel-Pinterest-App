import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MessageCircle } from 'lucide-react-native';
import { useTheme } from '../../../context/ThemeContext';
import { TYPOGRAPHY, SPACING } from '../../../constants/theme';
import { useOrganizerDiscussions } from './hooks';
import DiscussionTabCard from './components/DiscussionTabCard';

export default function TripDiscussionScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  
  const { data: discussions, isLoading, refetch, isRefetching } = useOrganizerDiscussions();

  const handleOpenDiscussion = (item: any) => {
    if (item.discussion_id) {
      navigation.navigate('Discussion', {
        discussionId: item.discussion_id,
        tripTitle: item.title,
      });
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.loaderContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={discussions || []}
        keyExtractor={(item) => item.trip_id}
        renderItem={({ item }) => (
          <DiscussionTabCard item={item} onPress={() => handleOpenDiscussion(item)} />
        )}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Discussions</Text>
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MessageCircle color={colors.ternary} size={48} />
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No discussions yet</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              Create a trip and discussions will appear here automatically.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { paddingHorizontal: SPACING.md, paddingBottom: 100 },
  headerTitle: { fontSize: TYPOGRAPHY.sizes.xl, fontFamily: TYPOGRAPHY.fontFamilyBold, textAlign: 'center', paddingTop: SPACING.xl + 20, paddingBottom: SPACING.lg },
  emptyContainer: { alignItems: 'center', paddingTop: SPACING.xl * 2, gap: SPACING.sm },
  emptyTitle: { fontSize: TYPOGRAPHY.sizes.lg, fontFamily: TYPOGRAPHY.fontFamilyBold },
  emptySubtitle: { fontSize: TYPOGRAPHY.sizes.sm, fontFamily: TYPOGRAPHY.fontFamily, textAlign: 'center', paddingHorizontal: SPACING.xl },
});
