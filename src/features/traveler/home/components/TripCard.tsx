import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Calendar, IndianRupee, Bookmark } from 'lucide-react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { TYPOGRAPHY, SHAPES, SPACING } from '../../../../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function formatDateRange(start?: string, end?: string) {
  if (!start) return 'Date TBD';
  const s = new Date(start);
  const sStr = s.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  if (!end) return sStr;
  const e = new Date(end);
  const eStr = e.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  return `${sStr}-${eStr}`;
}

interface TripCardProps {
  item: any;
  onPress: () => void;
}

export default function TripCard({ item, onPress }: TripCardProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.cardLeft}>
        <Text style={[styles.tripTitle, { color: colors.textPrimary }]} numberOfLines={3}>
          {item.title}
        </Text>
        <View style={styles.infoRow}>
          <Calendar color={colors.iconDisabled} size={14} />
          <Text style={[styles.infoText, { color: colors.iconDisabled }]}>
            {formatDateRange(item.start_date, item.end_date)}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <IndianRupee color={colors.textPrimary} size={14} />
          <Text style={[styles.budgetText, { color: colors.textPrimary }]}>
            {item.budget?.toLocaleString('en-IN') || '0'} for one person
          </Text>
        </View>
        {item.location?.name && (
          <Text style={[styles.fromText, { color: colors.secondary }]}>
            From {item.location.name}
          </Text>
        )}
      </View>

      <View style={styles.cardRight}>
        {item.cover_image ? (
          <Image source={{ uri: item.cover_image }} style={styles.coverImage} />
        ) : (
          <View style={[styles.coverImage, { backgroundColor: colors.ternary }]} />
        )}
        <TouchableOpacity style={styles.bookmarkBtn}>
          <Bookmark color={colors.background} size={18} />
        </TouchableOpacity>
        <View style={styles.organizerOverlay}>
          <View style={[styles.organizerAvatar, { backgroundColor: colors.secondary }]}>
            <Text style={styles.organizerInitial}>
              {item.organizer?.name?.[0]?.toUpperCase() || 'O'}
            </Text>
          </View>
          <Text style={styles.organizerName} numberOfLines={2}>
            {item.organizer?.name || 'Organizer'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    borderRadius: SHAPES.roundedLarge,
    overflow: 'hidden',
    borderWidth: 1,
    minHeight: 160,
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
  budgetText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontFamily: TYPOGRAPHY.fontFamilySemiBold,
  },
  fromText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontFamily: TYPOGRAPHY.fontFamily,
    marginTop: 4,
  },
  cardRight: {
    width: SCREEN_WIDTH * 0.38,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  bookmarkBtn: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  organizerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs + 2,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  organizerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  organizerInitial: {
    color: '#fff',
    fontFamily: TYPOGRAPHY.fontFamilyBold,
    fontSize: 11,
  },
  organizerName: {
    color: '#fff',
    fontFamily: TYPOGRAPHY.fontFamilySemiBold,
    fontSize: 11,
    flex: 1,
  },
});
