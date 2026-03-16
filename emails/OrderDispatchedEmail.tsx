import {
  Body,
  Button,
  Container,

  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { EmailHead, EmailHeader, EmailFooter } from "./_shared";

interface OrderDispatchedEmailProps {
  customerName: string;
  orderNumber: string;
  trackingNumber?: string | null;
  logoUrl?: string;
}

export default function OrderDispatchedEmail({
  customerName,
  orderNumber,
  trackingNumber,
  logoUrl,
}: OrderDispatchedEmailProps) {
  const trackingUrl = trackingNumber
    ? `https://starken.cl/tracking/${trackingNumber}`
    : null;

  return (
    <Html lang="es">
      <EmailHead />
      <Preview>Tu pedido {orderNumber} está en camino 🚚</Preview>
      <Body style={body}>
        <Container style={container}>
          <EmailHeader logoUrl={logoUrl} />
          <Section style={content}>
            <Heading style={h1}>¡Tu pedido está en camino!</Heading>
            <Text style={text}>
              Hola {customerName}, tu pedido <strong>{orderNumber}</strong> fue
              despachado y ya está en manos de Starken.
            </Text>
            <Section style={estimateBox}>
              <Text style={estimateLabel}>Tiempo estimado de entrega</Text>
              <Text style={estimateValue}>3 – 5 días hábiles</Text>
            </Section>
            {trackingNumber && (
              <>
                <Section style={trackingBox}>
                  <Text style={trackingLabel}>Número de seguimiento</Text>
                  <Text style={trackingCode}>{trackingNumber}</Text>
                </Section>
                <Section style={buttonContainer}>
                  <Button style={button} href={trackingUrl ?? "#"}>
                    Rastrear Envío
                  </Button>
                </Section>
              </>
            )}
            {!trackingNumber && (
              <Text style={text}>
                En cuanto tengamos el número de seguimiento te lo haremos llegar.
                Puedes escribirnos a WhatsApp si tienes cualquier consulta.
              </Text>
            )}
            <Section style={{ marginTop: "8px" }}>
              <Text style={{ color: "#666666", fontSize: "13px", textAlign: "center", margin: 0 }}>
                ¿Tienes alguna duda?{" "}
                <a href="https://wa.me/56992723158?text=Hola!%20Quiero%20consultar%20sobre%20mi%20pedido" style={{ color: "#000000" }}>
                  Escríbenos por WhatsApp
                </a>
              </Text>
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
const text: React.CSSProperties = { color: "#444444", fontSize: "15px", lineHeight: "24px", margin: "0 0 16px" };
const estimateBox: React.CSSProperties = {
  backgroundColor: "#EFECDA", borderRadius: "4px", margin: "20px 0", padding: "16px 20px", textAlign: "center",
};
const estimateLabel: React.CSSProperties = {
  color: "#000000", fontSize: "11px", fontWeight: "700", letterSpacing: "1px", margin: "0 0 4px", textTransform: "uppercase",
};
const estimateValue: React.CSSProperties = { color: "#000000", fontSize: "20px", fontWeight: "700", margin: 0 };
const trackingBox: React.CSSProperties = {
  backgroundColor: "#F5F5F5", borderRadius: "4px", margin: "0 0 20px", padding: "16px 20px", textAlign: "center",
};
const trackingLabel: React.CSSProperties = {
  color: "#666666", fontSize: "11px", fontWeight: "600", letterSpacing: "1px", margin: "0 0 8px", textTransform: "uppercase",
};
const trackingCode: React.CSSProperties = {
  color: "#000000", fontFamily: "monospace", fontSize: "18px", fontWeight: "700", margin: 0,
};
const buttonContainer: React.CSSProperties = { textAlign: "center", marginTop: "4px", marginBottom: "20px" };
const button: React.CSSProperties = {
  backgroundColor: "#000000", borderRadius: "2px", color: "#EFECDA", display: "inline-block",
  fontSize: "13px", fontWeight: "600", letterSpacing: "2px", padding: "14px 32px",
  textDecoration: "none", textTransform: "uppercase",
};
const hr: React.CSSProperties = { borderColor: "#E5E5E5", margin: "0 40px" };
