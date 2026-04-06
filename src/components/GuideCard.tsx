import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import type { GuideProfile } from '../types';

interface Props {
  guide: GuideProfile;
  onPress?: () => void;
}

export default function GuideCard({ guide, onPress }: Props): React.JSX.Element {
  const initials = guide.name
    ? guide.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {guide.avatar_url ? (
        <Image source={{ uri: guide.avatar_url }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarFallback}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.name}>{guide.name}</Text>
        <Text style={styles.bio} numberOfLines={2}>{guide.bio || 'Local expert guide'}</Text>
        <View style={styles.stats}>
          <Text style={styles.stat}>⭐ {(guide.rating ?? 0).toFixed(1)}</Text>
          <Text style={styles.statDivider}>·</Text>
          <Text style={styles.stat}>{guide.total_reviews} reviews</Text>
          <Text style={styles.statDivider}>·</Text>
          <Text style={styles.stat}>{guide.tours_completed} tours</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#1e1e30',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2a2a40',
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  avatarFallback: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  info: {
    flex: 1,
    gap: 4,
  },
  name: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  bio: {
    color: '#999',
    fontSize: 12,
    lineHeight: 17,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  stat: {
    color: '#aaa',
    fontSize: 11,
    fontWeight: '600',
  },
  statDivider: {
    color: '#555',
    fontSize: 11,
  },
});
