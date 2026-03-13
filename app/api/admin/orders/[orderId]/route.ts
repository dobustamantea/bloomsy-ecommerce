import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { adminOrderStatusSchema } from "@/lib/admin-schema";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: {
    orderId: string;
  };
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const parsed = adminOrderStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Estado de pedido invalido." },
        { status: 400 }
      );
    }

    await prisma.order.update({
      where: {
        id: params.orderId,
      },
      data: {
        status: parsed.data.status,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PATCH /api/admin/orders/[orderId]] error:", error);
    return NextResponse.json(
      { error: "No fue posible actualizar el pedido." },
      { status: 500 }
    );
  }
}
