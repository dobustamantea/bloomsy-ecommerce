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

interface WelcomeEmailProps {
  name: string;
  logoUrl?: string;
}

export default function WelcomeEmail({ name, logoUrl }: WelcomeEmailProps) {
  return (
    <Html lang="es">
      <EmailHead />
      <Preview>Bienvenida a Bloomsy, {name} 🌸</Preview>
      <Body style={body}>
        <Container style={container}>
          <EmailHeader logoUrl={logoUrl} />
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
          <EmailFooter unsubscribeNote="Recibiste este email porque te registraste en bloomsy.cl." />
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
  color: "#000000", fontSize: "22px", fontWeight: "600", margin: "0 0 16px",
};
const text: React.CSSProperties = {
  color: "#444444", fontSize: "15px", lineHeight: "24px", margin: "0 0 16px",
};
const buttonContainer: React.CSSProperties = { textAlign: "center", marginTop: "24px" };
const button: React.CSSProperties = {
  backgroundColor: "#000000", borderRadius: "2px", color: "#EFECDA",
  display: "inline-block", fontSize: "13px", fontWeight: "600",
  letterSpacing: "2px", padding: "14px 32px", textDecoration: "none",
  textTransform: "uppercase",
};
const hr: React.CSSProperties = { borderColor: "#E5E5E5", margin: "0 40px" };
