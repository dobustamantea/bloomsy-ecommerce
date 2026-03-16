import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [totalProducts, pendingOrders, subscriberCount, nonCancelledOrders, allVariants] =
      await Promise.all([
        prisma.product.count({ where: { isActive: true } }),
        prisma.order.count({ where: { status: "pending" } }),
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

    // Group stock by product and find products with total stock < 5
    const stockByProduct = new Map<string, number>();
    for (const v of allVariants) {
      stockByProduct.set(v.productId, (stockByProduct.get(v.productId) ?? 0) + v.stock);
    }
    let lowStockProducts = 0;
    stockByProduct.forEach((stock) => { if (stock < 5) lowStockProducts++; });

    return NextResponse.json({
      totalProducts,
      pendingOrders,
      subscribers: subscriberCount,
      totalRevenue,
      lowStockProducts,
    });
  } catch {
    return NextResponse.json({ error: "Error fetching dashboard" }, { status: 500 });
  }
}
