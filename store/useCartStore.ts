import { create } from "zustand";
import type { CartItem, Product, ProductColor } from "@/types";

interface CartState {
  items: CartItem[];
  addItem: (product: Product, size: string, color: ProductColor) => void;
  removeItem: (productId: string, size: string, colorName: string) => void;
  updateQuantity: (
    productId: string,
    size: string,
    colorName: string,
    qty: number
  ) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (product, size, color) => {
    const existing = get().items.find(
      (item) =>
        item.product.id === product.id &&
        item.size === size &&
        item.color.name === color.name
    );
    if (existing) {
      set({
        items: get().items.map((item) =>
          item.product.id === product.id &&
          item.size === size &&
          item.color.name === color.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      });
    } else {
      set({ items: [...get().items, { product, size, color, quantity: 1 }] });
    }
  },

  removeItem: (productId, size, colorName) => {
    set({
      items: get().items.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.size === size &&
            item.color.name === colorName
          )
      ),
    });
  },

  updateQuantity: (productId, size, colorName, qty) => {
    if (qty <= 0) {
      get().removeItem(productId, size, colorName);
      return;
    }
    set({
      items: get().items.map((item) =>
        item.product.id === productId &&
        item.size === size &&
        item.color.name === colorName
          ? { ...item, quantity: qty }
          : item
      ),
    });
  },

  clearCart: () => set({ items: [] }),
}));

// Selectors (use these in components for granular subscriptions)
export const selectItemCount = (state: CartState) =>
  state.items.reduce((sum, item) => sum + item.quantity, 0);

export const selectTotal = (state: CartState) =>
  state.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
