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

interface NewsletterWelcomeEmailProps {
  promoCode: string;
}

export default function NewsletterWelcomeEmail({ promoCode }: NewsletterWelcomeEmailProps) {
  const shopUrl = `https://bloomsy.cl/shop?promo=${promoCode}`;

  return (
    <Html lang="es">
      <Head />
      <Preview>Tu 10% de descuento en Bloomsy 🌸</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={logo}>BLOOMSY</Heading>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Heading style={h1}>¡Bienvenida a la comunidad!</Heading>
            <Text style={text}>
              Nos alegra que formes parte de Bloomsy. Como regalo de bienvenida,
              tienes un <strong>10% de descuento</strong> en tu primera compra.
            </Text>

            {/* Promo code */}
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

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Instagram:{" "}
              <a href="https://instagram.com/bloomsy.cl" style={link}>
                @bloomsy.cl
              </a>{" "}
              · WhatsApp:{" "}
              <a href="https://wa.me/56992723158" style={link}>
                +56 9 9272 3158
              </a>
            </Text>
            <Text style={footerSmall}>
              Recibiste este email porque te suscribiste en bloomsy.cl.{" "}
              <a href="https://bloomsy.cl/unsubscribe" style={link}>
                Cancelar suscripción
              </a>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

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

const header: React.CSSProperties = {
  backgroundColor: "#000000",
  padding: "24px 40px",
  textAlign: "center",
};

const logo: React.CSSProperties = {
  color: "#EFECDA",
  fontSize: "24px",
  fontWeight: "700",
  letterSpacing: "6px",
  margin: 0,
};

const content: React.CSSProperties = {
  padding: "40px 40px 32px",
};

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
  margin: "0 0 20px",
};

const textSmall: React.CSSProperties = {
  color: "#666666",
  fontSize: "13px",
  lineHeight: "20px",
  margin: "20px 0 0",
};

const codeBox: React.CSSProperties = {
  backgroundColor: "#000000",
  borderRadius: "4px",
  margin: "0 0 24px",
  padding: "24px",
  textAlign: "center",
};

const codeLabel: React.CSSProperties = {
  color: "#EFECDA",
  fontSize: "11px",
  fontWeight: "600",
  letterSpacing: "2px",
  margin: "0 0 12px",
  textTransform: "uppercase",
};

const codeValue: React.CSSProperties = {
  color: "#EFECDA",
  fontFamily: "monospace",
  fontSize: "28px",
  fontWeight: "700",
  letterSpacing: "4px",
  margin: "0 0 8px",
};

const codeNote: React.CSSProperties = {
  color: "#888888",
  fontSize: "12px",
  margin: 0,
};

const buttonContainer: React.CSSProperties = {
  textAlign: "center",
};

const button: React.CSSProperties = {
  backgroundColor: "#000000",
  borderRadius: "2px",
  color: "#EFECDA",
  display: "inline-block",
  fontSize: "13px",
  fontWeight: "600",
  letterSpacing: "2px",
  padding: "14px 32px",
  textDecoration: "none",
  textTransform: "uppercase",
};

const hr: React.CSSProperties = {
  borderColor: "#E5E5E5",
  margin: "0 40px",
};

const footer: React.CSSProperties = {
  padding: "24px 40px",
  textAlign: "center",
};

const footerText: React.CSSProperties = {
  color: "#888888",
  fontSize: "13px",
  margin: "0 0 8px",
};

const footerSmall: React.CSSProperties = {
  color: "#AAAAAA",
  fontSize: "11px",
  margin: 0,
};

const link: React.CSSProperties = {
  color: "#000000",
};
