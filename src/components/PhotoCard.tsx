import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import type { TourismPhoto } from '../types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 36) / 2;

interface Props {
  photo: TourismPhoto;
  isSaved: boolean;
  onPress: () => void;
  onSave: () => void;
}

const BADGE_COLORS: Record<string, string> = {
  agro: '#4caf50',
  marine: '#2196f3',
  history: '#ff9800',
  culture: '#e91e63',
};

export default function PhotoCard({ photo, isSaved, onPress, onSave }: Props): React.JSX.Element {
  const badgeColor = BADGE_COLORS[photo.tourism_type] ?? '#6C63FF';
  const initials = photo.guide?.name
    ? photo.guide.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  return (
    <TouchableOpacity style={[styles.card, { width: CARD_WIDTH }]} onPress={onPress} activeOpacity={0.9}>
      {/* Photo */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: photo.photo_url }}
          style={styles.image}
          resizeMode="cover"
        />
        {/* Badge */}
        <View style={[styles.badge, { backgroundColor: badgeColor }]}>
          <Text style={styles.badgeText}>{photo.tourism_type.toUpperCase()}</Text>
        </View>
        {/* Save button */}
        <TouchableOpacity style={styles.saveBtn} onPress={onSave} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.saveIcon}>{isSaved ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
        {/* Quality score */}
        <View style={styles.scorePill}>
          <Text style={styles.scoreText}>⭐ {photo.quality_score}</Text>
        </View>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{photo.title}</Text>
        {!!photo.location && (
          <Text style={styles.location} numberOfLines={1}>📍 {photo.location}</Text>
        )}

        {/* Guide row */}
        <View style={styles.guideRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.guideInfo}>
            <Text style={styles.guideName} numberOfLines={1}>{photo.guide?.name ?? 'Unknown'}</Text>
            <Text style={styles.guideRating}>⭐ {(photo.guide?.rating ?? 0).toFixed(1)}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.cta} onPress={onPress}>
          <Text style={styles.ctaText}>Take Me There →</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#16162a',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2a2a40',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: '#1e1e30',
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  saveBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 99,
    padding: 6,
  },
  saveIcon: {
    fontSize: 14,
  },
  scorePill: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
  },
  scoreText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  info: {
    padding: 10,
    gap: 4,
  },
  title: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  location: {
    color: '#888',
    fontSize: 11,
  },
  guideRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  guideInfo: {
    flex: 1,
  },
  guideName: {
    color: '#ccc',
    fontSize: 11,
    fontWeight: '600',
  },
  guideRating: {
    color: '#888',
    fontSize: 10,
    marginTop: 1,
  },
  cta: {
    backgroundColor: '#6C63FF',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  ctaText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
});
