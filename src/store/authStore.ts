import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { api } from 'src/services/api';

interface JwtPayload {
  sub: string;
  exp: number;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  userId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (token: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const loggedOutState = {
  accessToken: null,
  refreshToken: null,
  userId: null,
  isAuthenticated: false,
  isLoading: false,
};


let refreshPromise: Promise<void> | null = null;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      userId: null,
      isAuthenticated: false,
      isLoading: true,

      setAuth: async (accessToken, refreshToken) => {
        try {
          const decoded = jwtDecode<JwtPayload>(accessToken);
          set({
            accessToken,
            refreshToken,
            userId: decoded.sub ?? null,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (e) {
          console.error('Failed to set auth tokens', e);
        }
      },

      logout: async () => {
        set(loggedOutState);
      },

      checkAuth: async () => {
        const { accessToken, refreshToken } = get();

        if (!accessToken || !refreshToken) {
          set({ isAuthenticated: false, isLoading: false });
          return;
        }

        try {
          const decoded = jwtDecode<JwtPayload>(accessToken);
          const accessExpired = Date.now() >= decoded.exp * 1000;

          if (accessExpired) {
            // check refresh token expiry client-side before making network call
            const decodedRefresh = jwtDecode<JwtPayload>(refreshToken);
            const refreshExpired = Date.now() >= decodedRefresh.exp * 1000;

            if (refreshExpired) {
              // Both tokens expired — skip the network round-trip
              set(loggedOutState);
              return;
            }

            try {
              await get().refreshAuth();
            } catch {
              set(loggedOutState);
            }
          } else {
            set({
              userId: decoded.sub ?? null,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch {
          set({ isAuthenticated: false, isLoading: false });
        }
      },

      refreshAuth: async () => {
        //  coalesce concurrent callers behind a single in-flight promise
        if (refreshPromise) {
          return refreshPromise;
        }

        const doRefresh = async (): Promise<void> => {
          const { refreshToken } = get();

          if (!refreshToken) {
            await get().logout();
            throw new Error('No refresh token');
          }

          try {
            const data = await api.refreshAuth({
              refresh_token: refreshToken,
            });

            if (!data) {
              throw new Error('Refresh failed');
            }

            await get().setAuth(data.access_token, data.refresh_token);
          } catch (error) {
            await get().logout();
            throw error;
          }
        };

        refreshPromise = doRefresh().finally(() => {
          refreshPromise = null;
        });

        return refreshPromise;
      },
    }),
    {
      name: 'travel_auth_store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        userId: state.userId,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => {
        return (state) => {
          if (state) {
            state.checkAuth();
          }
        };
      },
    }
  )
);