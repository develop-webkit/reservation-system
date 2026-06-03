import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialState = {
  token: null,
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
          token: payload.access_token,
          expiresIn: payload.expiresIn ?? null,
          user: payload.user ?? null,
          client: payload.client ?? null,
          isAuthenticated: Boolean(payload.access_token),
        }),
      logout: () => set({ ...initialState }),
    }),
    {
      name: 'rms-auth',
      partialize: (state) => ({
        token: state.token,
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

export default useAuthStore;
