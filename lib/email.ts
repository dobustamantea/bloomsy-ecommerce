import { Resend } from "resend";
import { render } from "@react-email/components";
import { prisma } from "@/lib/prisma";
import WelcomeEmail from "@/emails/WelcomeEmail";
import OrderConfirmationEmail from "@/emails/OrderConfirmationEmail";
import OrderDispatchedEmail from "@/emails/OrderDispatchedEmail";
import OrderReadyForPickupEmail from "@/emails/OrderReadyForPickupEmail";
import PasswordResetEmail from "@/emails/PasswordResetEmail";
import NewsletterWelcomeEmail from "@/emails/NewsletterWelcomeEmail";

// ─── Types ────────────────────────────────────────────────────────────────────

interface OrderEmailData {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  shippingType: "delivery" | "pickup";
  address?: string | null;
  city?: string | null;
  region?: string | null;
  paymentMethod: "webpay" | "transfer";
  subtotal: number;
  shipping: number;
  total: number;
  items: {
    name: string;
    size: string;
    color: string;
    quantity: number;
    price: number;
  }[];
}

// ─── Client ───────────────────────────────────────────────────────────────────

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

// Use verified domain; falls back to Resend test sender
const FROM = process.env.RESEND_FROM_EMAIL ?? "Bloomsy <onboarding@resend.dev>";

// Public URL of the Bloomsy logo (hosted on Supabase Storage or any CDN)
const LOGO_URL = process.env.LOGO_URL ?? "https://ikuacwkjcheyjlitfvit.supabase.co/storage/v1/object/public/product-images/assets/Bloomsy%20SoloW.png";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generatePromoCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 8 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  try {
    const resend = getResend();
    const { error } = await resend.emails.send({
      from: FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    if (error) console.error("[email] Resend error:", error);
  } catch (err) {
    console.error("[email] send failed:", err);
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function sendWelcomeEmail(email: string, name: string): Promise<void> {
  const html = await render(WelcomeEmail({ name, logoUrl: LOGO_URL }));
  await sendEmail({ to: email, subject: `Bienvenida a Bloomsy, ${name} 🌸`, html });
}

export async function sendOrderConfirmationEmail(
  email: string,
  order: OrderEmailData
): Promise<void> {
  const html = await render(
    OrderConfirmationEmail({
      customerName: order.customerName,
      orderNumber: order.orderNumber,
      orderId: order.id,
      items: order.items,
      subtotal: order.subtotal,
      shipping: order.shipping,
      total: order.total,
      shippingType: order.shippingType,
      address: order.address,
      city: order.city,
      region: order.region,
      paymentMethod: order.paymentMethod,
      logoUrl: LOGO_URL,
    })
  );
  await sendEmail({
    to: email,
    subject: `Tu pedido ${order.orderNumber} fue recibido ✅`,
    html,
  });
}

export async function sendOrderDispatchedEmail(
  email: string,
  order: Pick<OrderEmailData, "customerName" | "orderNumber">,
  trackingNumber?: string | null
): Promise<void> {
  const html = await render(
    OrderDispatchedEmail({
      customerName: order.customerName,
      orderNumber: order.orderNumber,
      trackingNumber,
      logoUrl: LOGO_URL,
    })
  );
  await sendEmail({
    to: email,
    subject: `Tu pedido ${order.orderNumber} está en camino 🚚`,
    html,
  });
}

export async function sendOrderReadyForPickupEmail(
  email: string,
  order: Pick<OrderEmailData, "customerName" | "orderNumber">
): Promise<void> {
  const html = await render(
    OrderReadyForPickupEmail({
      customerName: order.customerName,
      orderNumber: order.orderNumber,
      logoUrl: LOGO_URL,
    })
  );
  await sendEmail({
    to: email,
    subject: `Tu pedido ${order.orderNumber} está listo para retiro 🛍️`,
    html,
  });
}

export async function sendPasswordResetEmail(
  email: string,
  resetToken: string
): Promise<void> {
  const html = await render(PasswordResetEmail({ resetToken, logoUrl: LOGO_URL }));
  await sendEmail({ to: email, subject: "Restablecer tu contraseña en Bloomsy", html });
}

export async function sendNewsletterWelcomeEmail(email: string): Promise<void> {
  // Generate a unique code and save it to DB so it can be validated at checkout
  let promoCode = generatePromoCode();
  // Retry if code already exists (extremely unlikely but safe)
  let attempts = 0;
  while (attempts < 5) {
    const existing = await prisma.discountCode.findUnique({ where: { code: promoCode } });
    if (!existing) break;
    promoCode = generatePromoCode();
    attempts++;
  }

  await prisma.discountCode.create({
    data: {
      code: promoCode,
      type: "PERCENTAGE",
      value: 10,        // 10% off
      maxUses: 1,       // one-time use only
      isActive: true,
      // Expires in 30 days
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  const html = await render(NewsletterWelcomeEmail({ promoCode, logoUrl: LOGO_URL }));
  await sendEmail({
    to: email,
    subject: "¡Bienvenida a Bloomsy! Aquí tienes tu 10% de descuento 🌸",
    html,
  });
}
