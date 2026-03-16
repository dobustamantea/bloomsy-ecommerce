import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { EmailHeader, EmailFooter } from "./_shared";

interface NewsletterWelcomeEmailProps {
  promoCode: string;
  logoUrl?: string;
}

export default function NewsletterWelcomeEmail({ promoCode, logoUrl }: NewsletterWelcomeEmailProps) {
  const shopUrl = `https://bloomsy.cl/shop?promo=${promoCode}`;

  return (
    <Html lang="es">
      <Head />
      <Preview>Tu 10% de descuento en Bloomsy 🌸</Preview>
      <Body style={body}>
        <Container style={container}>
          <EmailHeader logoUrl={logoUrl} />
          <Section style={content}>
            <Heading style={h1}>¡Bienvenida a la comunidad!</Heading>
            <Text style={text}>
              Nos alegra que formes parte de Bloomsy. Como regalo de bienvenida,
              tienes un <strong>10% de descuento</strong> en tu primera compra.
            </Text>
            <Section style={codeBox}>
              <Text style={codeLabel}>Tu código de descuento</Text>
              <Text style={codeValue}>{promoCode}</Text>
              <Text style={codeNote}>Válido por 30 días · Una sola vez</Text>
            </Section>
            <Section style={buttonContainer}>
              <Button style={button} href={shopUrl}>
                Ir a la Tienda
              </Button>
            </Section>
            <Text style={textSmall}>
              Recibirás nuestras novedades, lanzamientos y ofertas exclusivas.
              Nunca spam, solo cosas que valen la pena.
            </Text>
          </Section>
          <Hr style={hr} />
          <EmailFooter unsubscribeNote="Recibiste este email porque te suscribiste en bloomsy.cl." />
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
const textSmall: React.CSSProperties = { color: "#666666", fontSize: "13px", lineHeight: "20px", margin: "20px 0 0" };
const codeBox: React.CSSProperties = {
  backgroundColor: "#000000", borderRadius: "4px", margin: "0 0 24px", padding: "24px", textAlign: "center",
};
const codeLabel: React.CSSProperties = {
  color: "#EFECDA", fontSize: "11px", fontWeight: "600", letterSpacing: "2px", margin: "0 0 12px", textTransform: "uppercase",
};
const codeValue: React.CSSProperties = {
  color: "#EFECDA", fontFamily: "monospace", fontSize: "28px", fontWeight: "700", letterSpacing: "4px", margin: "0 0 8px",
};
const codeNote: React.CSSProperties = { color: "#888888", fontSize: "12px", margin: 0 };
const buttonContainer: React.CSSProperties = { textAlign: "center" };
const button: React.CSSProperties = {
  backgroundColor: "#000000", borderRadius: "2px", color: "#EFECDA", display: "inline-block",
  fontSize: "13px", fontWeight: "600", letterSpacing: "2px", padding: "14px 32px",
  textDecoration: "none", textTransform: "uppercase",
};
const hr: React.CSSProperties = { borderColor: "#E5E5E5", margin: "0 40px" };
