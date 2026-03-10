import type { Metadata } from "next";
import CartClient from "@/components/cart/CartClient";

export const metadata: Metadata = {
  title: "Carrito",
  description: "Revisa los productos seleccionados y finaliza tu compra.",
};

export default function CartPage() {
  return <CartClient />;
}
