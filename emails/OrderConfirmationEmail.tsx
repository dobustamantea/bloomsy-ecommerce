import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import { EmailHeader, EmailFooter } from "./_shared";

interface OrderItem {
  name: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

interface OrderConfirmationEmailProps {
  customerName: string;
  orderNumber: string;
  orderId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingType: "delivery" | "pickup";
  address?: string | null;
  city?: string | null;
  region?: string | null;
  paymentMethod: "webpay" | "transfer";
  logoUrl?: string;
}

function formatCLP(amount: number): string {
  return `$${amount.toLocaleString("es-CL")}`;
}

export default function OrderConfirmationEmail({
  customerName,
  orderNumber,
  orderId,
  items,
  subtotal,
  shipping,
  total,
  shippingType,
  address,
  city,
  region,
  paymentMethod,
  logoUrl,
}: OrderConfirmationEmailProps) {
  const orderUrl = `https://bloomsy.cl/order/${orderId}`;

  return (
    <Html lang="es">
      <Head />
      <Preview>Tu pedido {orderNumber} fue recibido ✅</Preview>
      <Body style={body}>
        <Container style={container}>
          <EmailHeader logoUrl={logoUrl} />
          <Section style={content}>
            <Heading style={h1}>¡Gracias por tu pedido!</Heading>
            <Text style={text}>
              Hola {customerName}, recibimos tu pedido <strong>{orderNumber}</strong>.{" "}
              {paymentMethod === "transfer"
                ? "Recuerda enviar el comprobante de pago para comenzar a prepararlo."
                : "Lo estamos preparando con mucho cuidado."}
            </Text>

            <Section style={tableHeader}>
              <Row>
                <Column style={{ ...th, width: "40%" }}>Producto</Column>
                <Column style={{ ...th, width: "20%" }}>Talla / Color</Column>
                <Column style={{ ...th, width: "15%", textAlign: "center" }}>Cant.</Column>
                <Column style={{ ...th, width: "25%", textAlign: "right" }}>Precio</Column>
              </Row>
            </Section>

            {items.map((item, i) => (
              <Section key={i} style={i % 2 === 0 ? tableRowEven : tableRowOdd}>
                <Row>
                  <Column style={{ ...td, width: "40%" }}>{item.name}</Column>
                  <Column style={{ ...td, width: "20%" }}>{item.size} / {item.color}</Column>
                  <Column style={{ ...td, width: "15%", textAlign: "center" }}>{item.quantity}</Column>
                  <Column style={{ ...td, width: "25%", textAlign: "right" }}>{formatCLP(item.price * item.quantity)}</Column>
                </Row>
              </Section>
            ))}

            <Section style={totalsSection}>
              <Row>
                <Column style={totalLabel}>Subtotal</Column>
                <Column style={totalValue}>{formatCLP(subtotal)}</Column>
              </Row>
              <Row>
                <Column style={totalLabel}>Despacho</Column>
                <Column style={totalValue}>{shipping === 0 ? "Gratis" : formatCLP(shipping)}</Column>
              </Row>
              <Row>
                <Column style={totalLabelBold}>Total</Column>
                <Column style={totalValueBold}>{formatCLP(total)}</Column>
              </Row>
            </Section>

            {shippingType === "delivery" && address && (
              <Section style={infoBox}>
                <Text style={infoLabel}>Dirección de despacho</Text>
                <Text style={infoValue}>
                  {address}{city ? `, ${city}` : ""}{region ? `, ${region}` : ""}
                </Text>
              </Section>
            )}
            {shippingType === "pickup" && (
              <Section style={infoBox}>
                <Text style={infoLabel}>Retiro en tienda</Text>
                <Text style={infoValue}>Te avisaremos cuando tu pedido esté listo para retirar.</Text>
              </Section>
            )}

            <Section style={buttonContainer}>
              <Button style={button} href={orderUrl}>
                Ver Detalles del Pedido
              </Button>
            </Section>
          </Section>

          <Hr style={hr} />
          <EmailFooter />
        </Container>
      </Body>
    </Html>
  );
}

const body: React.CSSProperties = {
  backgroundColor: "#EFECDA", fontFamily: "'DM Sans', Arial, sans-serif", margin: 0, padding: "32px 0",
};
const container: React.CSSProperties = {
  backgroundColor: "#ffffff", margin: "0 auto", maxWidth: "560px", borderRadius: "4px", overflow: "hidden",
};
const content: React.CSSProperties = { padding: "40px 40px 32px" };
const h1: React.CSSProperties = { color: "#000000", fontSize: "22px", fontWeight: "600", margin: "0 0 16px" };
const text: React.CSSProperties = { color: "#444444", fontSize: "15px", lineHeight: "24px", margin: "0 0 20px" };
const tableHeader: React.CSSProperties = { backgroundColor: "#000000", borderRadius: "2px", padding: "0 8px" };
const th: React.CSSProperties = {
  color: "#EFECDA", fontSize: "11px", fontWeight: "600", letterSpacing: "1px",
  padding: "10px 8px", textTransform: "uppercase",
};
const tableRowEven: React.CSSProperties = { backgroundColor: "#FAFAFA", padding: "0 8px" };
const tableRowOdd: React.CSSProperties = { backgroundColor: "#ffffff", padding: "0 8px" };
const td: React.CSSProperties = { color: "#333333", fontSize: "13px", lineHeight: "20px", padding: "10px 8px" };
const totalsSection: React.CSSProperties = { borderTop: "2px solid #000000", marginTop: "8px", paddingTop: "12px" };
const totalLabel: React.CSSProperties = { color: "#666666", fontSize: "13px", padding: "4px 8px" };
const totalValue: React.CSSProperties = { color: "#333333", fontSize: "13px", padding: "4px 8px", textAlign: "right" };
const totalLabelBold: React.CSSProperties = { color: "#000000", fontSize: "15px", fontWeight: "700", padding: "8px 8px 0" };
const totalValueBold: React.CSSProperties = { color: "#000000", fontSize: "15px", fontWeight: "700", padding: "8px 8px 0", textAlign: "right" };
const infoBox: React.CSSProperties = { backgroundColor: "#EFECDA", borderRadius: "4px", marginTop: "24px", padding: "16px 20px" };
const infoLabel: React.CSSProperties = {
  color: "#000000", fontSize: "11px", fontWeight: "700", letterSpacing: "1px", margin: "0 0 4px", textTransform: "uppercase",
};
const infoValue: React.CSSProperties = { color: "#444444", fontSize: "14px", lineHeight: "20px", margin: 0 };
const buttonContainer: React.CSSProperties = { textAlign: "center", marginTop: "28px" };
const button: React.CSSProperties = {
  backgroundColor: "#000000", borderRadius: "2px", color: "#EFECDA", display: "inline-block",
  fontSize: "13px", fontWeight: "600", letterSpacing: "2px", padding: "14px 32px",
  textDecoration: "none", textTransform: "uppercase",
};
const hr: React.CSSProperties = { borderColor: "#E5E5E5", margin: "0 40px" };
