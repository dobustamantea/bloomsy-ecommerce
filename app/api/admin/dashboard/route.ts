import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [
      totalProducts,
      pendingOrders,
      toDispatchOrders,
      shippedOrders,
      todayOrders,
      subscriberCount,
      nonCancelledOrders,
      allVariants,
    ] = await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count({ where: { status: "pending" } }),
      prisma.order.count({ where: { status: { in: ["paid", "preparing"] } } }),
      prisma.order.count({ where: { status: "shipped" } }),
      prisma.order.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.subscriber.count(),
      prisma.order.findMany({
        where: { status: { not: "cancelled" } },
        select: { total: true },
      }),
      prisma.productVariant.findMany({
        select: { productId: true, stock: true },
      }),
    ]);

    const totalRevenue = nonCancelledOrders.reduce((sum, o) => sum + o.total, 0);

    const stockByProduct = new Map<string, number>();
    for (const v of allVariants) {
      stockByProduct.set(v.productId, (stockByProduct.get(v.productId) ?? 0) + v.stock);
    }
    let lowStockProducts = 0;
    stockByProduct.forEach((stock) => { if (stock < 5) lowStockProducts++; });

    return NextResponse.json({
      totalProducts,
      pendingOrders,
      toDispatchOrders,
      shippedOrders,
      todayOrders,
      subscribers: subscriberCount,
      totalRevenue,
      lowStockProducts,
    });
  } catch {
    return NextResponse.json({ error: "Error fetching dashboard" }, { status: 500 });
  }
}
