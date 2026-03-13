import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { addressSchema } from "@/lib/account-schema";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
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

    const existingCount = await prisma.address.count({
      where: { userId: session.user.id },
    });

    const shouldBeDefault = parsed.data.isDefault || existingCount === 0;

    const address = await prisma.$transaction(async (tx) => {
      if (shouldBeDefault) {
        await tx.address.updateMany({
          where: { userId: session.user.id, isDefault: true },
          data: { isDefault: false },
        });
      }

      return tx.address.create({
        data: {
          userId: session.user.id,
          label: parsed.data.label.trim(),
          recipientName: parsed.data.recipientName.trim(),
          phone: parsed.data.phone.trim() || null,
          line1: parsed.data.line1.trim(),
          line2: parsed.data.line2?.trim() || null,
          city: parsed.data.city.trim(),
          region: parsed.data.region.trim(),
          postalCode: parsed.data.postalCode?.trim() || null,
          isDefault: shouldBeDefault,
        },
      });
    });

    return NextResponse.json({ ok: true, address });
  } catch (error) {
    console.error("[POST /api/account/addresses] error:", error);

    return NextResponse.json(
      { error: "No fue posible guardar la direccion." },
      { status: 500 }
    );
  }
}
