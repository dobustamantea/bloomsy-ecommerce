import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { getAdminSession } from "@/lib/admin-auth";
import { adminColorSchema } from "@/lib/admin-schema";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const parsed = adminColorSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Revisa los datos del color." },
        { status: 400 }
      );
    }

    const color = await prisma.color.create({
      data: parsed.data,
    });

    return NextResponse.json({ success: true, colorId: color.id });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Ya existe un color con ese nombre." },
        { status: 409 }
      );
    }

    console.error("[POST /api/admin/colors] error:", error);
    return NextResponse.json(
      { error: "No fue posible crear el color." },
      { status: 500 }
    );
  }
}
