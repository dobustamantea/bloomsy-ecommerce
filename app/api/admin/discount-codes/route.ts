import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const codes = await prisma.discountCode.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { orders: true } } },
    });
    return NextResponse.json(codes);
  } catch {
    return NextResponse.json({ error: "Error fetching discount codes" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { code, type, value, minOrderAmount, maxUses, expiresAt } = await req.json();
    if (!code || !type || value == null) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }
    const discount = await prisma.discountCode.create({
      data: {
        code: String(code).toUpperCase().trim(),
        type,
        value: Number(value),
        minOrderAmount: minOrderAmount ? Number(minOrderAmount) : null,
        maxUses: maxUses ? Number(maxUses) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });
    return NextResponse.json(discount, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error && e.message.includes("Unique") ? "Código ya existe" : "Error al crear";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
