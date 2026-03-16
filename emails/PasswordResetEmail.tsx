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

interface PasswordResetEmailProps {
  resetToken: string;
}

export default function PasswordResetEmail({ resetToken }: PasswordResetEmailProps) {
  const resetUrl = `https://bloomsy.cl/auth/reset-password?token=${resetToken}`;

  return (
    <Html lang="es">
      <Head />
      <Preview>Restablece tu contraseña de Bloomsy</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={logo}>BLOOMSY</Heading>
          </Section>

          {/* Content */}
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
              Si no solicitaste este cambio, puedes ignorar este email. Tu
              contraseña actual seguirá siendo la misma.
            </Text>

            <Text style={textSmall}>
              Si tienes problemas con el botón, copia y pega esta URL en tu
              navegador:
            </Text>
            <Text style={urlText}>{resetUrl}</Text>
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
              Bloomsy · bloomsy.cl ·{" "}
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
  margin: "0 0 12px",
};

const buttonContainer: React.CSSProperties = {
  textAlign: "center",
  margin: "8px 0 24px",
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

const warningBox: React.CSSProperties = {
  backgroundColor: "#FFF8E1",
  border: "1px solid #FFE082",
  borderRadius: "4px",
  marginBottom: "20px",
  padding: "12px 16px",
};

const warningText: React.CSSProperties = {
  color: "#5D4037",
  fontSize: "13px",
  lineHeight: "20px",
  margin: 0,
};

const urlText: React.CSSProperties = {
  color: "#888888",
  fontSize: "11px",
  lineHeight: "16px",
  margin: "0 0 16px",
  wordBreak: "break-all",
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
