import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  TextInput,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import GuideCard from '../../components/GuideCard';
import { photoService } from '../../services/photoService';
import { authService } from '../../services/authService';
import { useStore } from '../../store/useStore';
import type { TourismPhoto, Review, GuideProfile } from '../../types';
import type { RootStackParamList } from '../../navigation/RootNavigator';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PhotoDetail'>;
  route: RouteProp<RootStackParamList, 'PhotoDetail'>;
};

const BADGE_COLORS: Record<string, string> = {
  agro: '#4caf50',
  marine: '#2196f3',
  history: '#ff9800',
  culture: '#e91e63',
};

export default function PhotoDetailScreen({ navigation, route }: Props): React.JSX.Element {
  const { photoId } = route.params;
  const savedPhotoIds = useStore((s) => s.savedPhotoIds);
  const toggleSaved = useStore((s) => s.toggleSaved);

  const [photo, setPhoto] = useState<TourismPhoto | null>(null);
  const [guide, setGuide] = useState<GuideProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  // Review form
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    load();
  }, [photoId]);

  const load = async () => {
    setLoading(true);
    try {
      const { photo: p, guide: g, reviews: r } = await photoService.getPhotoDetail(photoId);
      setPhoto(p);
      setGuide(g);
      setReviews(r);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!photo) return;
    toggleSaved(photo.id);
    try {
      if (savedPhotoIds.has(photo.id)) {
        await photoService.unsavePhoto(photo.id);
      } else {
        await photoService.savePhoto(photo.id);
      }
    } catch {
      if (photo) toggleSaved(photo.id);
    }
  };

  const handleBook = async () => {
    if (!photo) return;
    setBooking(true);
    try {
      const result = await authService.createBooking(photo.id);
      Alert.alert('🎉 Booking Confirmed!', `Guide will contact you at: ${result.guide_contact}`);
    } catch {
      Alert.alert('Error', 'Could not create booking. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!photo || !reviewText.trim()) return;
    setSubmittingReview(true);
    try {
      const r = await photoService.createReview({
        photo_id: photo.id,
        rating: reviewRating,
        comment: reviewText.trim(),
      });
      setReviews((prev) => [r, ...prev]);
      setReviewText('');
    } catch {
      Alert.alert('Error', 'Could not submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  if (!photo) {
    return (
      <View style={styles.loading}>
        <Text style={{ color: '#fff' }}>Photo not found</Text>
      </View>
    );
  }

  const badgeColor = BADGE_COLORS[photo.tourism_type] ?? '#6C63FF';
  const isSaved = savedPhotoIds.has(photo.id);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: photo.photo_url }} style={styles.hero} resizeMode="cover" />
          {/* Back button */}
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          {/* Save button */}
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveIcon}>{isSaved ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
          {/* Badge */}
          <View style={[styles.badge, { backgroundColor: badgeColor }]}>
            <Text style={styles.badgeText}>{photo.tourism_type.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.content}>
          {/* Title & location */}
          <Text style={styles.title}>{photo.title}</Text>
          {!!photo.location && <Text style={styles.location}>📍 {photo.location}</Text>}

          {/* Tags */}
          {photo.auto_tags?.length > 0 && (
            <View style={styles.tagsRow}>
              {photo.auto_tags.map((tag, i) => (
                <View key={i} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{photo.quality_score}</Text>
              <Text style={styles.statLabel}>Quality</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{photo.views_count ?? 0}</Text>
              <Text style={styles.statLabel}>Views</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{reviews.length}</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
          </View>

          {/* Description */}
          {!!photo.description && (
            <Text style={styles.description}>{photo.description}</Text>
          )}

          {/* Guide Card */}
          {guide && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your Guide</Text>
              <GuideCard guide={guide} />
            </View>
          )}

          {/* Book Button */}
          <TouchableOpacity
            style={[styles.bookBtn, booking && styles.bookBtnDisabled]}
            onPress={handleBook}
            disabled={booking}
          >
            {booking ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.bookBtnText}>🗓 Book This Experience</Text>
            )}
          </TouchableOpacity>

          {/* Reviews */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reviews ({reviews.length})</Text>

            {/* Add review */}
            <View style={styles.reviewForm}>
              <View style={styles.ratingRow}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <TouchableOpacity key={n} onPress={() => setReviewRating(n)}>
                    <Text style={{ fontSize: 22, opacity: n <= reviewRating ? 1 : 0.3 }}>⭐</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                style={styles.reviewInput}
                placeholder="Share your experience..."
                placeholderTextColor="#555"
                multiline
                value={reviewText}
                onChangeText={setReviewText}
              />
              <TouchableOpacity
                style={[styles.submitReview, submittingReview && styles.bookBtnDisabled]}
                onPress={handleSubmitReview}
                disabled={submittingReview}
              >
                <Text style={styles.submitReviewText}>
                  {submittingReview ? 'Submitting...' : 'Post Review'}
                </Text>
              </TouchableOpacity>
            </View>

            {reviews.map((r) => (
              <View key={r.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewUser}>{r.user_name}</Text>
                  <Text style={styles.reviewRating}>{'⭐'.repeat(r.rating)}</Text>
                </View>
                <Text style={styles.reviewComment}>{r.comment}</Text>
                <Text style={styles.reviewDate}>
                  {new Date(r.created_at).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f0f1a' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0f1a' },
  heroContainer: { position: 'relative' },
  hero: { width: '100%', height: 320 },
  backBtn: {
    position: 'absolute', top: 16, left: 16,
    backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 99,
    width: 36, height: 36, justifyContent: 'center', alignItems: 'center',
  },
  backIcon: { color: '#fff', fontSize: 20, fontWeight: '700' },
  saveBtn: {
    position: 'absolute', top: 16, right: 16,
    backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 99,
    width: 36, height: 36, justifyContent: 'center', alignItems: 'center',
  },
  saveIcon: { fontSize: 16 },
  badge: {
    position: 'absolute', bottom: 12, left: 16,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99,
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  content: { padding: 16, gap: 12 },
  title: { color: '#fff', fontSize: 22, fontWeight: '800', lineHeight: 28 },
  location: { color: '#888', fontSize: 13 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { backgroundColor: '#1e1e30', borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: '#2a2a40' },
  tagText: { color: '#8888cc', fontSize: 12, fontWeight: '600' },
  statsRow: {
    flexDirection: 'row', backgroundColor: '#1e1e30',
    borderRadius: 14, padding: 14, gap: 0, borderWidth: 1, borderColor: '#2a2a40',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statNum: { color: '#6C63FF', fontSize: 22, fontWeight: '800' },
  statLabel: { color: '#888', fontSize: 11, marginTop: 2 },
  description: { color: '#bbb', fontSize: 14, lineHeight: 20 },
  section: { gap: 10, marginTop: 4 },
  sectionTitle: { color: '#fff', fontSize: 17, fontWeight: '800' },
  bookBtn: {
    backgroundColor: '#6C63FF', borderRadius: 14,
    paddingVertical: 16, alignItems: 'center',
  },
  bookBtnDisabled: { opacity: 0.6 },
  bookBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  reviewForm: { backgroundColor: '#1e1e30', borderRadius: 14, padding: 14, gap: 10, borderWidth: 1, borderColor: '#2a2a40' },
  ratingRow: { flexDirection: 'row', gap: 4 },
  reviewInput: {
    backgroundColor: '#0f0f1a', borderRadius: 10, padding: 10,
    color: '#fff', minHeight: 70, textAlignVertical: 'top', fontSize: 13, borderWidth: 1, borderColor: '#2a2a40',
  },
  submitReview: { backgroundColor: '#6C63FF', borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  submitReviewText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  reviewCard: { backgroundColor: '#1e1e30', borderRadius: 12, padding: 12, gap: 4, borderWidth: 1, borderColor: '#2a2a40' },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reviewUser: { color: '#fff', fontWeight: '700', fontSize: 13 },
  reviewRating: { fontSize: 12 },
  reviewComment: { color: '#bbb', fontSize: 13, lineHeight: 18 },
  reviewDate: { color: '#555', fontSize: 11 },
});
