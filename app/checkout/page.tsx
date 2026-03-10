import type { Metadata } from "next";
import CheckoutForm from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Finaliza tu compra en Bloomsy.",
};

export default function CheckoutPage() {
  return <CheckoutForm />;
}
