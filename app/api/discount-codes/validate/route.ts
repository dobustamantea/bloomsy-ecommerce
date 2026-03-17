import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { code, orderTotal } = await req.json();
    if (!code || typeof orderTotal !== "number") {
      return NextResponse.json({ valid: false, message: "Datos inválidos" }, { status: 400 });
    }

    const discount = await prisma.discountCode.findUnique({
      where: { code: String(code).toUpperCase().trim() },
    });

    if (!discount) return NextResponse.json({ valid: false, message: "Código no válido" });
    if (!discount.isActive) return NextResponse.json({ valid: false, message: "Código inactivo" });
    if (discount.expiresAt && discount.expiresAt < new Date()) {
      return NextResponse.json({ valid: false, message: "Código expirado" });
    }
    if (discount.maxUses !== null && discount.usedCount >= discount.maxUses) {
      return NextResponse.json({ valid: false, message: "Código agotado" });
    }
    if (discount.minOrderAmount !== null && orderTotal < discount.minOrderAmount) {
      return NextResponse.json({
        valid: false,
        message: `Mínimo de compra: $${discount.minOrderAmount.toLocaleString("es-CL")}`,
      });
    }

    let discountAmount: number;
    if (discount.type === "PERCENTAGE") {
      discountAmount = Math.min(Math.round((orderTotal * discount.value) / 100), orderTotal);
    } else {
      discountAmount = Math.min(discount.value, orderTotal);
    }

    return NextResponse.json({
      valid: true,
      discountCodeId: discount.id,
      discountAmount,
      finalTotal: orderTotal - discountAmount,
      type: discount.type,
      value: discount.value,
    });
  } catch {
    return NextResponse.json({ valid: false, message: "Error al validar" }, { status: 500 });
  }
}
