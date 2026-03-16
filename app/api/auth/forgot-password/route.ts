import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { normalizeEmail } from "@/lib/auth-helpers";
import { sendPasswordResetEmail } from "@/lib/email";

const forgotSchema = z.object({
  email: z.string().trim().email("Ingresa un email válido."),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = forgotSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Ingresa un email válido." },
        { status: 400 }
      );
    }

    const email = normalizeEmail(parsed.data.email);

    // Always return success to prevent email enumeration attacks
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Store the token (using NextAuth VerificationToken table)
      await prisma.verificationToken.upsert({
        where: { identifier_token: { identifier: email, token } },
        create: { identifier: email, token, expires },
        update: { expires },
      });

      void sendPasswordResetEmail(email, token);
    }

    return NextResponse.json({
      success: true,
      message: "Si el email existe, recibirás un enlace para restablecer tu contraseña.",
    });
  } catch (error) {
    console.error("[POST /api/auth/forgot-password] error:", error);
    return NextResponse.json(
      { error: "No fue posible procesar la solicitud." },
      { status: 500 }
    );
  }
}
