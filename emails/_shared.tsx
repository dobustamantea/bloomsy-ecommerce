import { Img, Heading, Link, Section, Text } from "@react-email/components";

// ─── Shared header with logo ──────────────────────────────────────────────────

export function EmailHeader({ logoUrl }: { logoUrl?: string }) {
  return (
    <Section style={header}>
      {logoUrl ? (
        <Img
          src={logoUrl}
          alt="Bloomsy"
          width={140}
          height={40}
          style={{ margin: "0 auto", display: "block", objectFit: "contain" }}
        />
      ) : (
        <Heading style={logoText}>BLOOMSY</Heading>
      )}
    </Section>
  );
}

// ─── Shared footer ────────────────────────────────────────────────────────────

export function EmailFooter({ unsubscribeNote }: { unsubscribeNote?: string }) {
  return (
    <Section style={footer}>
      <Text style={footerText}>
        <Link href="https://instagram.com/bloomsy.cl" style={link}>@bloomsy.cl</Link>
        {" · "}
        <Link href="https://wa.me/56992723158" style={link}>+56 9 9272 3158</Link>
      </Text>
      <Text style={footerSmall}>
        {unsubscribeNote ?? "Bloomsy · bloomsy.cl"}{" · "}
        <Link href="https://bloomsy.cl/unsubscribe" style={link}>
          Cancelar suscripción
        </Link>
      </Text>
    </Section>
  );
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const header: React.CSSProperties = {
  backgroundColor: "#000000",
  padding: "20px 40px",
  textAlign: "center",
};

const logoText: React.CSSProperties = {
  color: "#EFECDA",
  fontSize: "24px",
  fontWeight: "700",
  letterSpacing: "6px",
  margin: 0,
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
