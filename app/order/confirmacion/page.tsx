import type { Metadata } from "next";
import ConfirmationClient from "@/components/order/ConfirmationClient";

export const metadata: Metadata = {
  title: "¡Pedido recibido!",
  description: "Tu pedido en Bloomsy fue procesado exitosamente.",
};

export default function ConfirmacionPage() {
  return <ConfirmationClient />;
}
