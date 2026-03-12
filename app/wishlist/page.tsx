import type { Metadata } from "next";
import WishlistClient from "@/components/wishlist/WishlistClient";

export const metadata: Metadata = {
  title: "Lista de deseos — Bloomsy",
  description: "Tus piezas favoritas de Bloomsy guardadas en un solo lugar.",
};

export default function WishlistPage() {
  return <WishlistClient />;
}
