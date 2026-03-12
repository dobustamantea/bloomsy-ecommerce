import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export interface CreateOrderPayload {
  customerName:  string;
  customerEmail: string;
  customerPhone: string;
  shippingType:  "delivery" | "pickup";
  address?:      string;
  city?:         string;
  region?:       string;
  paymentMethod: "webpay" | "transfer";
  items: {
    productId: string;
    name:      string;
    size:      string;
    color:     string;
    price:     number;
    quantity:  number;
  }[];
  subtotal: number;
  shipping: number;
  total:    number;
}

function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `BLM-${year}-${rand}`;
}

export async function POST(req: NextRequest) {
  try {
    const body: CreateOrderPayload = await req.json();

    const {
      customerName, customerEmail, customerPhone,
      shippingType, address, city, region,
      paymentMethod, items, subtotal, shipping, total,
    } = body;

    // Basic validation
    if (!customerName || !customerEmail || !items?.length) {
      return NextResponse.json(
        { success: false, error: "Faltan campos requeridos." },
        { status: 400 }
      );
    }

    // Ensure unique order number (retry once on collision)
    let orderNumber = generateOrderNumber();
    const existing = await prisma.order.findUnique({ where: { orderNumber } });
    if (existing) orderNumber = generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerEmail,
        customerPhone,
        shippingType,
        address:  address  ?? null,
        city:     city     ?? null,
        region:   region   ?? null,
        paymentMethod,
        subtotal,
        shipping,
        total,
        status: "pending",
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            name:      item.name,
            size:      item.size,
            color:     item.color,
            price:     item.price,
            quantity:  item.quantity,
          })),
        },
      },
    });

    return NextResponse.json({ success: true, orderNumber: order.orderNumber });
  } catch (err) {
    console.error("[POST /api/orders] error:", err);
    return NextResponse.json(
      { success: false, error: "Error interno al crear el pedido." },
      { status: 500 }
    );
  }
}
