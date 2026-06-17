import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialState = {
  expiresIn: null,
  user: null,
  client: null,
  isAuthenticated: false,
};

const useAuthStore = create(
  persist(
    (set) => ({
      ...initialState,
      login: (payload) =>
        set({
          expiresIn: payload.expiresIn ?? null,
          user: payload.user ?? null,
          client: payload.client ?? null,
          // JWT is in httpOnly cookie — authentication is confirmed by the presence of user data
          isAuthenticated: Boolean(payload.user),
        }),
      logout: () => set({ ...initialState }),
    }),
    {
      name: 'rms-auth',
      partialize: (state) => ({
        expiresIn: state.expiresIn,
        user: state.user,
        client: state.client,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

export const selectCurrentUser = (state) => state.user;
export const selectCurrentRole = (state) => state.user?.role ?? null;
export const selectCurrentClient = (state) => state.client;
export const selectLinkedClientNo = (state) => state.user?.linkedClientNo ?? null;
export const selectIs2FAEnabled = (state) => state.user?.is_2fa_enabled ?? false;

export default useAuthStore;
