import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { authService } from '../../services/authService';

const STATUS_COLORS: Record<string, string> = {
  pending: '#ff9800',
  confirmed: '#4caf50',
  completed: '#6C63FF',
  cancelled: '#f44336',
};

const STATUS_ICONS: Record<string, string> = {
  pending: '⏳',
  confirmed: '✅',
  completed: '🏁',
  cancelled: '❌',
};

export default function BookingsScreen(): React.JSX.Element {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const data = await authService.getBookings();
      setBookings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const color = STATUS_COLORS[item.status] ?? '#888';
    const icon = STATUS_ICONS[item.status] ?? '📋';
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardId}>Booking #{item.id}</Text>
          <View style={[styles.statusBadge, { backgroundColor: color + '22', borderColor: color }]}>
            <Text style={[styles.statusText, { color }]}>{icon} {item.status.toUpperCase()}</Text>
          </View>
        </View>
        <Text style={styles.date}>
          📅 {new Date(item.booking_date).toLocaleDateString('en-US', {
            weekday: 'short', month: 'short', day: 'numeric',
          })}
        </Text>
        <Text style={styles.expId}>Experience ID: {item.experience_id}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.header}>My Bookings</Text>
      {loading ? (
        <ActivityIndicator color="#6C63FF" style={{ marginTop: 60 }} />
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No bookings yet 🗓</Text>
              <Text style={styles.emptySubtext}>Browse photos and book your first tour!</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f0f1a' },
  header: { color: '#fff', fontSize: 24, fontWeight: '800', padding: 16, paddingBottom: 8 },
  list: { padding: 12, gap: 10 },
  card: {
    backgroundColor: '#16162a',
    borderRadius: 14,
    padding: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: '#2a2a40',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardId: { color: '#fff', fontSize: 15, fontWeight: '700' },
  statusBadge: {
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 99, borderWidth: 1,
  },
  statusText: { fontSize: 11, fontWeight: '800' },
  date: { color: '#888', fontSize: 13 },
  expId: { color: '#555', fontSize: 12 },
  empty: { alignItems: 'center', marginTop: 80, gap: 8 },
  emptyText: { color: '#888', fontSize: 18, fontWeight: '700' },
  emptySubtext: { color: '#555', fontSize: 13 },
});
