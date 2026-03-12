import type { Metadata } from "next";
import ConfirmationClient from "@/components/order/ConfirmationClient";

export const metadata: Metadata = {
  title: "¡Pedido recibido!",
  description: "Tu pedido en Bloomsy fue procesado exitosamente.",
};

interface Props {
  searchParams: { order?: string };
}

export default function ConfirmacionPage({ searchParams }: Props) {
  return <ConfirmationClient orderNumberFromUrl={searchParams.order} />;
}
