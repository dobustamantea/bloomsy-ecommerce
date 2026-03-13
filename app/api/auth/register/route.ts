import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  getDisplayName,
  normalizeEmail,
  registerSchema,
} from "@/lib/auth-helpers";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Revisa los datos del formulario." },
        { status: 400 }
      );
    }

    const email = normalizeEmail(parsed.data.email);
    const passwordHash = await hash(parsed.data.password, 12);
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser?.passwordHash) {
      return NextResponse.json(
        { error: "Ya existe una cuenta con ese email." },
        { status: 409 }
      );
    }

    const user = existingUser
      ? await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            name: existingUser.name ?? parsed.data.name.trim(),
            email,
            passwordHash,
          },
        })
      : await prisma.user.create({
          data: {
            name: parsed.data.name.trim(),
            email,
            passwordHash,
          },
        });

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        name: getDisplayName(user.name, user.email),
        email: user.email,
      },
    });
  } catch (error) {
    console.error("[POST /api/auth/register] error:", error);

    return NextResponse.json(
      { error: "No fue posible crear la cuenta." },
      { status: 500 }
    );
  }
}
