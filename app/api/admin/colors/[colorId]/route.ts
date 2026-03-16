import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/admin-auth";
import { adminColorSchema } from "@/lib/admin-schema";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: {
    colorId: string;
  };
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
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

    // Obtener el color actual para saber el nombre vigente antes de actualizar
    const currentColor = await prisma.color.findUnique({
      where: { id: params.colorId },
    });

    await prisma.color.update({
      where: {
        id: params.colorId,
      },
      data: parsed.data,
    });

    // Propagar cambios (nombre y/o hex) a todas las variantes que usen este color
    if (currentColor) {
      await prisma.productVariant
        .updateMany({
          where: { color: currentColor.name },
          data: {
            color: parsed.data.name,
            colorHex: parsed.data.hex,
          },
        })
        .catch(() => null);
    }

    // Invalidar caché de ISR para que los cambios sean inmediatos
    revalidatePath("/shop", "page");
    revalidatePath("/", "layout");

    return NextResponse.json({ success: true });
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

    console.error("[PATCH /api/admin/colors/[colorId]] error:", error);
    return NextResponse.json(
      { error: "No fue posible actualizar el color." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: RouteContext
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }
  try {
    await prisma.color.delete({ where: { id: params.colorId } });
    revalidatePath("/shop", "page");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/admin/colors/[colorId]] error:", error);
    return NextResponse.json(
      { error: "No fue posible eliminar el color." },
      { status: 500 }
    );
  }
}
