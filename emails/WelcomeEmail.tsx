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

interface WelcomeEmailProps {
  name: string;
}

export default function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <Html lang="es">
      <Head />
      <Preview>Bienvenida a Bloomsy, {name} 🌸</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={logo}>BLOOMSY</Heading>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Heading style={h1}>Hola, {name} 👋</Heading>
            <Text style={text}>
              Nos alegra tenerte aquí. En Bloomsy encontrarás prendas atemporales
              diseñadas para mujeres que valoran la calidad, el detalle y el
              estilo sin complicaciones.
            </Text>
            <Text style={text}>
              Explora nuestro catálogo y encuentra tu próxima pieza favorita.
            </Text>
            <Section style={buttonContainer}>
              <Button style={button} href="https://bloomsy.cl/shop">
                Ver Catálogo
              </Button>
            </Section>
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
              Recibiste este email porque te registraste en bloomsy.cl.{" "}
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
  margin: "0 0 16px",
};

const buttonContainer: React.CSSProperties = {
  textAlign: "center",
  marginTop: "24px",
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
