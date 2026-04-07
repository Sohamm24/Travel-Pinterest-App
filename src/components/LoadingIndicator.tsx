import React, { useEffect, useRef } from 'react';
import {
  Animated,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  View,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { spacing } from '../constants/spacing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - spacing.screenPadding * 2;
const IMAGE_HEIGHT = Math.round((CARD_WIDTH * 9) / 16);

// ─── Shimmer Skeleton ──────────────────────────────────────────────────────────

function SkeletonCard() {
  const { colors } = useTheme();
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [shimmer]);

  const bgColor = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.skeleton, colors.skeletonHighlight],
  });

  return (
    <View
      style={[
        styles.skeletonCard,
        { borderColor: colors.border },
      ]}
    >
      <Animated.View
        style={[
          styles.skeletonImage,
          { backgroundColor: bgColor, height: IMAGE_HEIGHT },
        ]}
      />
      <View style={[styles.skeletonMeta, { backgroundColor: colors.surface }]}>
        <Animated.View
          style={[styles.skeletonLine, { width: '55%', backgroundColor: bgColor }]}
        />
        <Animated.View
          style={[
            styles.skeletonLine,
            { width: '35%', backgroundColor: bgColor, marginTop: 6 },
          ]}
        />
      </View>
    </View>
  );
}

// ─── Exports ───────────────────────────────────────────────────────────────────

interface Props {
  variant?: 'skeleton' | 'spinner';
  count?: number;
}

export default function LoadingIndicator({ variant = 'skeleton', count = 3 }: Props) {
  const { colors } = useTheme();

  if (variant === 'spinner') {
    return (
      <View style={styles.spinnerWrapper}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.skeletonWrapper}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  skeletonWrapper: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  skeletonCard: {
    borderRadius: spacing.cardRadius,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    alignSelf: 'center',
    width: CARD_WIDTH,
  },
  skeletonImage: {
    width: '100%',
  },
  skeletonMeta: {
    padding: spacing.md,
  },
  skeletonLine: {
    height: 12,
    borderRadius: 6,
  },
  spinnerWrapper: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
});
