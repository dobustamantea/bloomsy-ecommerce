import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { profileSchema } from "@/lib/account-schema";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = profileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Revisa los datos del perfil." },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: parsed.data.name.trim(),
        phone: parsed.data.phone.trim() || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
    });

    return NextResponse.json({ ok: true, user });
  } catch (error) {
    console.error("[PATCH /api/account/profile] error:", error);

    return NextResponse.json(
      { error: "No fue posible actualizar tus datos." },
      { status: 500 }
    );
  }
}
