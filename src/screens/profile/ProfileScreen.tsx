import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image } from 'react-native';
import Constants from 'expo-constants';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useTheme } from '../../context/ThemeContext';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';
import { TouchableOpacity } from 'react-native';
import axios from 'axios';

type Post = {
  id: number;
  description: string;
  location: string;
  image_urls: string[];
};

// Use an env variable or default config for backend URL
const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL;

export default function ProfileScreen({ navigation }: any) {
  const { isLoaded, signOut, userId, getToken } = useAuth();
  const { user } = useUser();
  const { colors } = useTheme();
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyPosts();
  }, [userId]);

  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      // Ensure we send clerk ID 
      // the backend uses get_current_user with Clerk ID sent as Bearer for MVP
      const res = await axios.get(`${BACKEND_URL}/api/posts/user`, {
        headers: {
          Authorization: `Bearer ${userId}`,
        }
      });
      setPosts(res.data);
    } catch (error) {
      console.error('Failed to fetch user posts', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Post }) => (
    <View style={styles.postItem}>
      <Image source={{ uri: item.image_urls[0] }} style={styles.postImage} />
      <Text style={[styles.postLocation, { color: colors.textPrimary }]}>{item.location}</Text>
      <Text style={[styles.postDesc, { color: colors.textSecondary }]}>{item.description}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.email, { color: colors.textPrimary }]}>
          {user?.emailAddresses[0]?.emailAddress}
        </Text>
        <TouchableOpacity style={[styles.logoutBtn, { backgroundColor: colors.surface }]} onPress={() => signOut()}>
          <Text style={[styles.logoutText, { color: colors.textPrimary }]}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.myPostsHeading, { color: colors.textPrimary }]}>My Posts ({posts.length})</Text>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.list}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 20 }}>No posts yet.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  email: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
  },
  logoutBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.sm,
  },
  logoutText: {
    fontWeight: typography.semibold,
  },
  myPostsHeading: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    marginBottom: spacing.md,
  },
  list: {
    gap: spacing.sm,
  },
  postItem: {
    flex: 1,
    margin: spacing.xs,
  },
  postImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: spacing.sm,
    backgroundColor: '#333'
  },
  postLocation: {
    fontWeight: typography.bold,
    marginTop: spacing.xs,
  },
  postDesc: {
    fontSize: typography.sm,
  }
});
