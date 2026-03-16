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

interface PasswordResetEmailProps {
  resetToken: string;
  logoUrl?: string;
}

export default function PasswordResetEmail({ resetToken, logoUrl }: PasswordResetEmailProps) {
  const resetUrl = `https://bloomsy.cl/auth/reset-password?token=${resetToken}`;

  return (
    <Html lang="es">
      <EmailHead />
      <Preview>Restablece tu contraseña de Bloomsy</Preview>
      <Body style={body}>
        <Container style={container}>
          <EmailHeader logoUrl={logoUrl} />
          <Section style={content}>
            <Heading style={h1}>Restablecer contraseña</Heading>
            <Text style={text}>
              Recibimos una solicitud para restablecer la contraseña de tu cuenta
              en Bloomsy. Haz clic en el botón a continuación para crear una nueva.
            </Text>
            <Section style={buttonContainer}>
              <Button style={button} href={resetUrl}>
                Restablecer Contraseña
              </Button>
            </Section>
            <Section style={warningBox}>
              <Text style={warningText}>
                ⚠️ Este enlace es válido por <strong>24 horas</strong> y solo puede
                usarse una vez. No lo compartas con nadie.
              </Text>
            </Section>
            <Text style={textSmall}>
              Si no solicitaste este cambio, puedes ignorar este email.
            </Text>
            <Text style={textSmall}>
              Si tienes problemas con el botón, copia y pega esta URL:
            </Text>
            <Text style={urlText}>{resetUrl}</Text>
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
const textSmall: React.CSSProperties = { color: "#666666", fontSize: "13px", lineHeight: "20px", margin: "0 0 12px" };
const buttonContainer: React.CSSProperties = { textAlign: "center", margin: "8px 0 24px" };
const button: React.CSSProperties = {
  backgroundColor: "#000000", borderRadius: "2px", color: "#EFECDA", display: "inline-block",
  fontSize: "13px", fontWeight: "600", letterSpacing: "2px", padding: "14px 32px",
  textDecoration: "none", textTransform: "uppercase",
};
const warningBox: React.CSSProperties = {
  backgroundColor: "#FFF8E1", border: "1px solid #FFE082", borderRadius: "4px", marginBottom: "20px", padding: "12px 16px",
};
const warningText: React.CSSProperties = { color: "#5D4037", fontSize: "13px", lineHeight: "20px", margin: 0 };
const urlText: React.CSSProperties = { color: "#888888", fontSize: "11px", lineHeight: "16px", margin: "0 0 16px", wordBreak: "break-all" };
const hr: React.CSSProperties = { borderColor: "#E5E5E5", margin: "0 40px" };
