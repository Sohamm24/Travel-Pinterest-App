import React, { memo, useCallback, useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { typography } from '../constants/typography';
import { spacing } from '../constants/spacing';
import { titleCase } from '../services/utils';
import type { ImageResult } from '../types/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Grid card takes 50% of screen width minus padding
const GRID_COLUMNS = 2;
const TOTAL_PADDING = spacing.screenPadding;
const CARD_WIDTH = (SCREEN_WIDTH - TOTAL_PADDING - spacing.md) / GRID_COLUMNS;
const IMAGE_HEIGHT = Math.round((CARD_WIDTH * 9) / 16); // 16:9

interface Props {
  image: ImageResult;
  onPress?: () => void;
  onLongPress?: () => void;
  showSimilarity?: boolean;
}

function ImageCard({ image, onPress, onLongPress, showSimilarity }: Props) {
  const { colors } = useTheme();

  // Fade + scale animation on load
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.96)).current;
  const pressScale = useRef(new Animated.Value(1)).current;

  const handleImageLoad = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, scale]);

  const handlePressIn = () => {
    Animated.spring(pressScale, {
      toValue: 0.97,
      useNativeDriver: true,
      friction: 8,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressScale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
    }).start();
  };

  const similarityPct =
    image.similarity_score != null
      ? Math.round(image.similarity_score * 100)
      : null;

  return (
    <Animated.View
      style={[
        styles.cardWrapper,
        { transform: [{ scale: pressScale }] },
      ]}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            width: CARD_WIDTH,
          },
        ]}
      >
        {/* Image */}
        <View style={[styles.imageWrapper, { backgroundColor: colors.skeleton }]}>
          <Animated.View
            style={{
              opacity,
              transform: [{ scale }],
              width: '100%',
              height: IMAGE_HEIGHT,
            }}
          >
            <Image
              source={{ uri: image.image_url }}
              style={{ width: '100%', height: IMAGE_HEIGHT }}
              resizeMode="cover"
              onLoad={handleImageLoad}
              accessibilityLabel={`Travel photo: ${image.category}`}
            />
          </Animated.View>

          {/* Category badge — top left */}
          {!!image.category && (
            <View
              style={[
                styles.badge,
                { backgroundColor: colors.primary },
              ]}
            >
              <Text style={styles.badgeText}>
                {titleCase(image.category)}
              </Text>
            </View>
          )}

          {/* Similarity score — top right (match results only) */}
          {showSimilarity && similarityPct != null && (
            <View
              style={[styles.simBadge, { backgroundColor: colors.overlay }]}
            >
              <Text style={[styles.simText, { color: '#fff' }]}>
                {similarityPct}% match
              </Text>
            </View>
          )}

          {/* Mood + quality — bottom gradient strip */}
          <View style={styles.metaStrip}>
            {!!image.mood && (
              <Text style={styles.moodText}>{titleCase(image.mood)}</Text>
            )}
            {image.quality_score != null && (
              <View style={styles.qualityPill}>
                <Text style={styles.qualityText}>
                  ★ {Number(image.quality_score).toFixed(1)}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default memo(ImageCard);

const styles = StyleSheet.create({
  cardWrapper: {
    alignItems: 'center',
  },
  card: {
    borderRadius: spacing.cardRadius,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  imageWrapper: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: spacing.cardRadius,
  },
  badge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: spacing.pillRadius,
  },
  badgeText: {
    color: '#000',
    fontSize: typography.xs,
    fontWeight: typography.bold,
    letterSpacing: 0.3,
  },
  simBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: spacing.pillRadius,
  },
  simText: {
    fontSize: typography.xs,
    fontWeight: typography.bold,
  },
  metaStrip: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  moodText: {
    color: '#fff',
    fontSize: typography.xs,
    fontWeight: typography.medium,
    flex: 1,
  },
  qualityPill: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: spacing.pillRadius,
  },
  qualityText: {
    color: '#fff',
    fontSize: typography.xs,
    fontWeight: typography.bold,
  },
});