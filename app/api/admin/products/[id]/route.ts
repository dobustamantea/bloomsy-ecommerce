import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        variants: { orderBy: [{ size: "asc" }, { color: "asc" }] },
        images: { orderBy: { position: "asc" } },
      },
    });
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Error fetching product" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const {
      name, slug, category, price, originalPrice,
      description, care, isNew, isFeatured, isActive,
      variants, images,
    } = body;

    const product = await prisma.$transaction(async (tx) => {
      await tx.productVariant.deleteMany({ where: { productId: id } });
      await tx.productImage.deleteMany({ where: { productId: id } });

      return tx.product.update({
        where: { id },
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
    });

    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Error updating product" }, { status: 500 });
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error deleting product" }, { status: 500 });
  }
}
