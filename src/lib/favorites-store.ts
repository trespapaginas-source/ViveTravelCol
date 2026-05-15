import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoritesState {
  /** Array of saved cabin IDs */
  favorites: string[];

  /** Add or remove a cabin from favorites */
  toggleFavorite: (cabinId: string) => void;

  /** Check if a cabin is in favorites (getter) */
  isFavorite: (cabinId: string) => boolean;

  /** Remove all favorites */
  clearFavorites: () => void;

  /** Get the number of saved favorites */
  getFavoriteCount: () => number;
}

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      toggleFavorite: (cabinId: string) => {
        set((state) => {
          const exists = state.favorites.includes(cabinId);
          return {
            favorites: exists
              ? state.favorites.filter((id) => id !== cabinId)
              : [...state.favorites, cabinId],
          };
        });
      },

      isFavorite: (cabinId: string) => {
        return get().favorites.includes(cabinId);
      },

      clearFavorites: () => {
        set({ favorites: [] });
      },

      getFavoriteCount: () => {
        return get().favorites.length;
      },
    }),
    {
      name: "vive-travel-favorites",
    }
  )
);
