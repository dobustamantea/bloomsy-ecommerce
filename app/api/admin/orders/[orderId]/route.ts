import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { adminOrderStatusSchema } from "@/lib/admin-schema";
import { prisma } from "@/lib/prisma";
import { sendOrderDispatchedEmail, sendOrderReadyForPickupEmail } from "@/lib/email";

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

    const order = await prisma.order.update({
      where: {
        id: params.orderId,
      },
      data: {
        status: parsed.data.status,
      },
    });

    // Trigger appropriate email when order is marked as shipped
    if (parsed.data.status === "shipped") {
      const isPickup =
        order.shippingType === "pickup" ||
        order.shippingType?.toLowerCase().includes("retiro");

      if (isPickup) {
        void sendOrderReadyForPickupEmail(order.customerEmail, {
          customerName: order.customerName,
          orderNumber: order.orderNumber,
        });
      } else {
        void sendOrderDispatchedEmail(
          order.customerEmail,
          { customerName: order.customerName, orderNumber: order.orderNumber },
          parsed.data.trackingNumber ?? null
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PATCH /api/admin/orders/[orderId]] error:", error);
    return NextResponse.json(
      { error: "No fue posible actualizar el pedido." },
      { status: 500 }
    );
  }
}
