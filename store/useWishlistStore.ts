import { create } from "zustand";

interface WishlistState {
  ids: string[];
  toggle: (id: string) => void;
  isWishlisted: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  ids: [],

  toggle: (id) => {
    const { ids } = get();
    if (ids.includes(id)) {
      set({ ids: ids.filter((i) => i !== id) });
    } else {
      set({ ids: [...ids, id] });
    }
  },

  isWishlisted: (id) => get().ids.includes(id),
}));

// Selectors
export const selectWishlistCount = (state: WishlistState) => state.ids.length;
