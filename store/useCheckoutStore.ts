import { create } from "zustand";
import type { CartItem } from "@/types";

export type DeliveryMethod = "delivery" | "pickup";
export type PaymentMethod = "webpay" | "transfer";

export interface LastOrder {
  orderNumber: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  customer: {
    fullName: string;
    email: string;
    phone: string;
  };
  deliveryMethod: DeliveryMethod;
  deliveryAddress?: {
    addressLine1: string;
    apartment?: string;
    city: string;
    region: string;
    postalCode?: string;
  };
  paymentMethod: PaymentMethod;
}

interface CheckoutState {
  lastOrder: LastOrder | null;
  setLastOrder: (order: LastOrder) => void;
  clearLastOrder: () => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  lastOrder: null,
  setLastOrder: (order) => set({ lastOrder: order }),
  clearLastOrder: () => set({ lastOrder: null }),
}));
