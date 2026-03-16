import { Head, Img, Heading, Link, Section, Text } from "@react-email/components";

// ─── Force light mode in all email clients that support color-scheme ──────────
export function EmailHead() {
  return (
    <Head>
      <meta name="color-scheme" content="light" />
      <meta name="supported-color-schemes" content="light" />
      <style>{`
        :root { color-scheme: light only; }
      `}</style>
    </Head>
  );
}

// ─── Shared header with logo ──────────────────────────────────────────────────
// Header uses cream background (#EFECDA) so the black logo is always visible
// regardless of dark mode. We also add x-apple-data-detectors and
// color-scheme=light via inline meta so email clients respect light palette.

export function EmailHeader({ logoUrl }: { logoUrl?: string }) {
  return (
    <Section style={header}>
      {logoUrl ? (
        <Img
          src={logoUrl}
          alt="Bloomsy"
          width={160}
          height={48}
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
  backgroundColor: "#EFECDA",          // crema = logo negro siempre visible
  padding: "20px 40px",
  textAlign: "center",
};

const logoText: React.CSSProperties = {
  color: "#000000",
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
