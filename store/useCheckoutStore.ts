import { create } from "zustand";

export interface CartItemSnapshot {
  name: string;
  slug: string;
  image: string;
  size: string;
  colorName: string;
  colorHex: string;
  price: number;
  quantity: number;
}

export interface OrderData {
  // Contact
  name: string;
  email: string;
  phone: string;
  // Delivery
  deliveryType: "delivery" | "pickup";
  address: string;
  apartment: string;
  city: string;
  region: string;
  postalCode: string;
  // Payment
  paymentMethod: "webpay" | "transfer";
  // Totals
  subtotal: number;
  shippingCost: number;
  total: number;
  // Items snapshot
  items: CartItemSnapshot[];
  // Generated
  orderNumber: string;
}

interface CheckoutState {
  order: OrderData | null;
  setOrder: (order: OrderData) => void;
  clearOrder: () => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  order: null,
  setOrder: (order) => set({ order }),
  clearOrder: () => set({ order: null }),
}));
