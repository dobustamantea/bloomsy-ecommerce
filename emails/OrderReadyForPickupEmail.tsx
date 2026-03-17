import {
  Body,
  Container,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { EmailHead, EmailHeader, EmailFooter } from "./_shared";

interface OrderReadyForPickupEmailProps {
  customerName: string;
  orderNumber: string;
  logoUrl?: string;
}

export default function OrderReadyForPickupEmail({
  customerName,
  orderNumber,
  logoUrl,
}: OrderReadyForPickupEmailProps) {
  return (
    <Html lang="es">
      <EmailHead />
      <Preview>Tu pedido {orderNumber} está listo para retiro 🛍️</Preview>
      <Body style={body}>
        <Container style={container}>
          <EmailHeader logoUrl={logoUrl} />
          <Section style={content}>
            <Heading style={h1}>¡Tu pedido está listo!</Heading>
            <Text style={text}>
              Hola {customerName}, tu pedido <strong>{orderNumber}</strong> ya
              está preparado y listo para que lo retires en nuestra tienda.
            </Text>
            <Section style={pickupBox}>
              <Text style={pickupLabel}>Estado del pedido</Text>
              <Text style={pickupValue}>Listo para retiro 🛍️</Text>
            </Section>
            <Text style={text}>
              Puedes pasar a retirarlo en el horario de atención habitual. Si
              tienes alguna duda o quieres coordinar el retiro, escríbenos
              directamente:
            </Text>
            <Section style={{ marginTop: "8px", marginBottom: "16px" }}>
              <Text style={whatsappText}>
                WhatsApp:{" "}
                <a
                  href="https://wa.me/56992723158?text=Hola!%20Quiero%20coordinar%20el%20retiro%20de%20mi%20pedido"
                  style={link}
                >
                  +56 9 9272 3158
                </a>
              </Text>
            </Section>
            <Text style={subText}>
              ¡Gracias por tu compra! Te esperamos 🌸
            </Text>
          </Section>
          <Hr style={hr} />
          <EmailFooter />
        </Container>
      </Body>
    </Html>
  );
}

const body: React.CSSProperties = {
  backgroundColor: "#EFECDA",
  fontFamily: "'DM Sans', Arial, sans-serif",
  margin: 0,
  padding: "32px 0",
};
const container: React.CSSProperties = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  maxWidth: "560px",
  borderRadius: "4px",
  overflow: "hidden",
};
const content: React.CSSProperties = { padding: "40px 40px 32px" };
const h1: React.CSSProperties = {
  color: "#000000",
  fontSize: "22px",
  fontWeight: "600",
  margin: "0 0 16px",
};
const text: React.CSSProperties = {
  color: "#444444",
  fontSize: "15px",
  lineHeight: "24px",
  margin: "0 0 16px",
};
const subText: React.CSSProperties = {
  color: "#666666",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0 0 8px",
};
const pickupBox: React.CSSProperties = {
  backgroundColor: "#EFECDA",
  borderRadius: "4px",
  margin: "20px 0",
  padding: "16px 20px",
  textAlign: "center",
};
const pickupLabel: React.CSSProperties = {
  color: "#000000",
  fontSize: "11px",
  fontWeight: "700",
  letterSpacing: "1px",
  margin: "0 0 4px",
  textTransform: "uppercase",
};
const pickupValue: React.CSSProperties = {
  color: "#000000",
  fontSize: "20px",
  fontWeight: "700",
  margin: 0,
};
const whatsappText: React.CSSProperties = {
  color: "#444444",
  fontSize: "15px",
  lineHeight: "24px",
  margin: 0,
  textAlign: "center" as const,
};
const link: React.CSSProperties = {
  color: "#000000",
  fontWeight: "600",
};
const hr: React.CSSProperties = { borderColor: "#E5E5E5", margin: "0 40px" };
