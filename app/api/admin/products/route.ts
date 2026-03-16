import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        variants: { orderBy: [{ size: "asc" }, { color: "asc" }] },
        images: { orderBy: { position: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products);
  } catch {
    return NextResponse.json({ error: "Error fetching products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name, slug, category, price, originalPrice,
      description, care, isNew, isFeatured, isActive,
      variants, images,
    } = body;

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        category,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : null,
        description,
        care: Array.isArray(care) ? care : [],
        isNew: Boolean(isNew),
        isFeatured: Boolean(isFeatured),
        isActive: isActive !== false,
        variants: {
          create: (variants ?? []).map((v: { size: string; color: string; colorHex: string; stock: number }) => ({
            size: v.size,
            color: v.color,
            colorHex: v.colorHex,
            stock: Number(v.stock),
          })),
        },
        images: {
          create: (images ?? []).map((url: string, i: number) => ({ url, position: i })),
        },
      },
      include: { variants: true, images: true },
    });

    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error creating product" }, { status: 500 });
  }
}
