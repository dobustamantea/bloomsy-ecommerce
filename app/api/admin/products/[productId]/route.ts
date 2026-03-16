import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/admin-auth";
import { adminProductSchema } from "@/lib/admin-schema";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: {
    productId: string;
  };
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
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

    const palette = await prisma.color
      .findMany({
        where: {
          isActive: true,
          name: {
            in: parsed.data.variants.map((variant) => variant.color),
          },
        },
      })
      .catch(() => []);

    const paletteByName = new Map(
      palette.map((color) => [color.name, color])
    );
    const hasInvalidColor = parsed.data.variants.some(
      (variant) => !paletteByName.has(variant.color)
    );

    if (hasInvalidColor) {
      return NextResponse.json(
        { error: "Una o mas variantes usan un color no disponible en la paleta." },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id: params.productId },
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
        },
      });

      await tx.productImage.deleteMany({
        where: {
          productId: params.productId,
        },
      });

      await tx.productVariant.deleteMany({
        where: {
          productId: params.productId,
        },
      });

      await tx.productImage.createMany({
        data: parsed.data.images.map((url, index) => ({
          productId: params.productId,
          url,
          position: index,
        })),
      });

      await tx.productVariant.createMany({
        data: parsed.data.variants.map((variant) => ({
          productId: params.productId,
          size: variant.size,
          color: variant.color,
          colorHex: paletteByName.get(variant.color)?.hex ?? variant.colorHex,
          stock: variant.stock,
        })),
      });
    });

    // Invalidar ISR para que los cambios sean visibles de inmediato
    revalidatePath("/shop", "page");
    revalidatePath(`/shop/${parsed.data.slug}`, "page");
    revalidatePath("/", "layout");

    return NextResponse.json({ success: true });
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

    console.error("[PATCH /api/admin/products/[productId]] error:", error);
    return NextResponse.json(
      { error: "No fue posible actualizar el producto." },
      { status: 500 }
    );
  }
}
