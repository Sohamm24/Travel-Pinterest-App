import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { authService } from '../../services/authService';
import { useStore } from '../../store/useStore';

export default function ProfileScreen(): React.JSX.Element {
  const { signOut } = useAuth();
  const user = useStore((s) => s.user);
  const setUser = useStore((s) => s.setUser);

  const [stats, setStats] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await authService.getStats();
      setStats(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          await authService.clearToken();
          setUser(null);
        },
      },
    ]);
  };

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.header}>Profile</Text>

      {/* Avatar + info */}
      <View style={styles.profileBlock}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.name}>{user?.name ?? 'Traveller'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={[styles.roleBadge, user?.role === 'guide' ? styles.guideRole : styles.touristRole]}>
          <Text style={styles.roleText}>
            {user?.role === 'guide' ? '🧭 Local Guide' : '🎒 Tourist'}
          </Text>
        </View>
      </View>

      {/* Stats */}
      {loading ? (
        <ActivityIndicator color="#6C63FF" style={{ marginTop: 20 }} />
      ) : stats ? (
        <View style={styles.statsGrid}>
          {Object.entries(stats).map(([k, v]) => (
            <View key={k} style={styles.statCard}>
              <Text style={styles.statNum}>{v}</Text>
              <Text style={styles.statLabel}>{k.replace(/_/g, ' ')}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {/* Bio */}
      {!!user?.bio && (
        <View style={styles.bioCard}>
          <Text style={styles.bioLabel}>About</Text>
          <Text style={styles.bio}>{user.bio}</Text>
        </View>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionText}>✏️  Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.signOutBtn]} onPress={handleSignOut}>
          <Text style={[styles.actionText, styles.signOutText]}>🚪  Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f0f1a' },
  header: { color: '#fff', fontSize: 24, fontWeight: '800', padding: 16, paddingBottom: 0 },
  profileBlock: { alignItems: 'center', paddingVertical: 24, gap: 6 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#6C63FF', justifyContent: 'center', alignItems: 'center',
    borderWidth: 3, borderColor: '#2a2a80',
  },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: '800' },
  name: { color: '#fff', fontSize: 20, fontWeight: '800', marginTop: 4 },
  email: { color: '#888', fontSize: 13 },
  roleBadge: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 99, marginTop: 6 },
  guideRole: { backgroundColor: '#6C63FF33', borderWidth: 1, borderColor: '#6C63FF' },
  touristRole: { backgroundColor: '#4caf5033', borderWidth: 1, borderColor: '#4caf50' },
  roleText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 10,
    paddingHorizontal: 16, justifyContent: 'center',
  },
  statCard: {
    backgroundColor: '#16162a', borderRadius: 14, padding: 16,
    alignItems: 'center', minWidth: 100, borderWidth: 1, borderColor: '#2a2a40',
  },
  statNum: { color: '#6C63FF', fontSize: 24, fontWeight: '800' },
  statLabel: { color: '#888', fontSize: 11, marginTop: 2, textTransform: 'capitalize' },
  bioCard: { margin: 16, backgroundColor: '#16162a', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#2a2a40' },
  bioLabel: { color: '#888', fontSize: 12, marginBottom: 4 },
  bio: { color: '#ccc', fontSize: 14, lineHeight: 20 },
  actions: { padding: 16, gap: 10, marginTop: 8 },
  actionBtn: {
    backgroundColor: '#16162a', borderRadius: 14, paddingVertical: 14,
    paddingHorizontal: 16, borderWidth: 1, borderColor: '#2a2a40',
  },
  actionText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  signOutBtn: { borderColor: '#f4433640' },
  signOutText: { color: '#f44336' },
});
