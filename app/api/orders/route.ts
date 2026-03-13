import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from "@/lib/utils";

const orderItemSchema = z.object({
  productId: z.string().min(1),
  size: z.string().min(1),
  color: z.string().min(1),
  quantity: z.number().int().min(1).max(20),
});

const createOrderSchema = z.object({
  customerName: z.string().trim().min(2),
  customerEmail: z.string().trim().email(),
  customerPhone: z.string().trim().min(7),
  shippingType: z.enum(["delivery", "pickup"]),
  address: z.string().trim().optional(),
  city: z.string().trim().optional(),
  region: z.string().trim().optional(),
  paymentMethod: z.enum(["webpay", "transfer"]),
  items: z.array(orderItemSchema).min(1),
});

function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `BLM-${year}-${rand}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Faltan campos requeridos o hay datos invalidos." },
        { status: 400 }
      );
    }

    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingType,
      address,
      city,
      region,
      paymentMethod,
      items,
    } = parsed.data;

    if (shippingType === "delivery" && (!address || !city || !region)) {
      return NextResponse.json(
        { success: false, error: "Completa la direccion de despacho." },
        { status: 400 }
      );
    }

    const productIds = Array.from(new Set(items.map((item) => item.productId)));
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true,
      },
      include: {
        variants: true,
      },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { success: false, error: "Uno o mas productos ya no estan disponibles." },
        { status: 400 }
      );
    }

    const productsById = new Map(products.map((product) => [product.id, product]));

    const normalizedItems = items.map((item) => {
      const product = productsById.get(item.productId);

      if (!product) {
        throw new Error("PRODUCT_NOT_FOUND");
      }

      const selectedVariant = product.variants.find(
        (variant) => variant.size === item.size && variant.color === item.color
      );

      if (!selectedVariant) {
        throw new Error("INVALID_VARIANT");
      }

      return {
        productId: product.id,
        name: product.name,
        size: selectedVariant.size,
        color: selectedVariant.color,
        price: product.price,
        quantity: item.quantity,
      };
    });

    const subtotal = normalizedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shipping =
      shippingType === "pickup" || subtotal >= FREE_SHIPPING_THRESHOLD
        ? 0
        : SHIPPING_COST;
    const total = subtotal + shipping;

    let orderNumber = generateOrderNumber();
    while (await prisma.order.findUnique({ where: { orderNumber } })) {
      orderNumber = generateOrderNumber();
    }

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerEmail,
        customerPhone,
        shippingType,
        address: address ?? null,
        city: city ?? null,
        region: region ?? null,
        paymentMethod,
        subtotal,
        shipping,
        total,
        status: "pending",
        items: {
          create: normalizedItems,
        },
      },
    });

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      subtotal,
      shipping,
      total,
      items: normalizedItems,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "PRODUCT_NOT_FOUND") {
        return NextResponse.json(
          { success: false, error: "Uno o mas productos ya no estan disponibles." },
          { status: 400 }
        );
      }

      if (error.message === "INVALID_VARIANT") {
        return NextResponse.json(
          { success: false, error: "La talla o color seleccionado ya no existe." },
          { status: 400 }
        );
      }
    }

    console.error("[POST /api/orders] error:", error);
    return NextResponse.json(
      { success: false, error: "Error interno al crear el pedido." },
      { status: 500 }
    );
  }
}
