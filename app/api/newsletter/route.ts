import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { normalizeEmail } from "@/lib/auth-helpers";

const newsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "El email es obligatorio.")
    .email("Ingresa un email valido."),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = newsletterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Ingresa un email valido." },
        { status: 400 }
      );
    }

    const email = normalizeEmail(parsed.data.email);
    const existingSubscriber = await prisma.subscriber.findUnique({
      where: {
        email,
      },
    });

    if (existingSubscriber) {
      return NextResponse.json({
        success: true,
        message: "Este correo ya estaba suscrito.",
      });
    }

    await prisma.subscriber.create({
      data: {
        email,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Te suscribiste correctamente.",
    });
  } catch (error) {
    console.error("[POST /api/newsletter] error:", error);
    return NextResponse.json(
      { success: false, error: "No fue posible completar la suscripcion." },
      { status: 500 }
    );
  }
}
