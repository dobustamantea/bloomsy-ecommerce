import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { addressSchema } from "@/lib/account-schema";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: {
    addressId: string;
  };
}

export async function PATCH(req: Request, { params }: RouteContext) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = addressSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Revisa los datos de la direccion." },
        { status: 400 }
      );
    }

    const existingAddress = await prisma.address.findFirst({
      where: {
        id: params.addressId,
        userId: session.user.id,
      },
    });

    if (!existingAddress) {
      return NextResponse.json(
        { error: "Direccion no encontrada." },
        { status: 404 }
      );
    }

    const address = await prisma.$transaction(async (tx) => {
      let nextIsDefault = parsed.data.isDefault;

      if (existingAddress.isDefault && !parsed.data.isDefault) {
        const replacement = await tx.address.findFirst({
          where: {
            userId: session.user.id,
            id: { not: params.addressId },
          },
          orderBy: { createdAt: "asc" },
        });

        if (replacement) {
          await tx.address.update({
            where: { id: replacement.id },
            data: { isDefault: true },
          });
        } else {
          nextIsDefault = true;
        }
      }

      if (parsed.data.isDefault) {
        await tx.address.updateMany({
          where: { userId: session.user.id, isDefault: true },
          data: { isDefault: false },
        });
      }

      return tx.address.update({
        where: { id: params.addressId },
        data: {
          label: parsed.data.label.trim(),
          recipientName: parsed.data.recipientName.trim(),
          phone: parsed.data.phone.trim() || null,
          line1: parsed.data.line1.trim(),
          line2: parsed.data.line2?.trim() || null,
          city: parsed.data.city.trim(),
          region: parsed.data.region.trim(),
          postalCode: parsed.data.postalCode?.trim() || null,
          isDefault: nextIsDefault,
        },
      });
    });

    return NextResponse.json({ ok: true, address });
  } catch (error) {
    console.error("[PATCH /api/account/addresses/[addressId]] error:", error);

    return NextResponse.json(
      { error: "No fue posible actualizar la direccion." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: RouteContext
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  try {
    const existingAddress = await prisma.address.findFirst({
      where: {
        id: params.addressId,
        userId: session.user.id,
      },
    });

    if (!existingAddress) {
      return NextResponse.json(
        { error: "Direccion no encontrada." },
        { status: 404 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.address.delete({
        where: { id: params.addressId },
      });

      if (existingAddress.isDefault) {
        const replacement = await tx.address.findFirst({
          where: { userId: session.user.id },
          orderBy: { createdAt: "asc" },
        });

        if (replacement) {
          await tx.address.update({
            where: { id: replacement.id },
            data: { isDefault: true },
          });
        }
      }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[DELETE /api/account/addresses/[addressId]] error:", error);

    return NextResponse.json(
      { error: "No fue posible eliminar la direccion." },
      { status: 500 }
    );
  }
}
