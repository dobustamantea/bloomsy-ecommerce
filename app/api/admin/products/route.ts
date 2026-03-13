import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { getAdminSession } from "@/lib/admin-auth";
import { adminProductSchema } from "@/lib/admin-schema";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const parsed = adminProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Revisa los datos del producto.", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        category: parsed.data.category,
        price: parsed.data.price,
        originalPrice: parsed.data.originalPrice,
        description: parsed.data.description,
        care: parsed.data.care,
        isNew: parsed.data.isNew,
        isFeatured: parsed.data.isFeatured,
        isActive: parsed.data.isActive,
        images: {
          create: parsed.data.images.map((url, index) => ({
            url,
            position: index,
          })),
        },
        variants: {
          create: parsed.data.variants.map((variant) => ({
            size: variant.size,
            color: variant.color,
            colorHex: variant.colorHex,
            stock: variant.stock,
          })),
        },
      },
    });

    return NextResponse.json({ success: true, productId: product.id });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Ya existe un producto con ese slug." },
        { status: 409 }
      );
    }

    console.error("[POST /api/admin/products] error:", error);
    return NextResponse.json(
      { error: "No fue posible crear el producto." },
      { status: 500 }
    );
  }
}
