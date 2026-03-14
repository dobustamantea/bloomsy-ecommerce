import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { isAdminEmail } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Admin",
  description: "Gestiona productos, pedidos y suscriptores de Bloomsy.",
};

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/account");
  }

  if (!isAdminEmail(session.user.email)) {
    return (
      <section className="mx-auto max-w-[900px] px-4 py-16 md:px-8">
        <div className="border border-black/10 bg-white/60 p-8 md:p-10">
          <p className="text-[10px] tracking-[0.28em] uppercase text-black/40">
            Acceso restringido
          </p>
          <h1 className="mt-4 font-display text-4xl font-light">
            Esta vista es solo para administracion
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-black/60">
            Tu cuenta esta autenticada, pero no figura en la lista de admins.
            Agrega tu email a la variable de entorno <code>ADMIN_EMAILS</code> para
            habilitar el panel.
          </p>
        </div>
      </section>
    );
  }

  let products: Awaited<ReturnType<typeof prisma.product.findMany<{ include: { images: true; variants: true } }>>> = [];
  let orders: Awaited<ReturnType<typeof prisma.order.findMany<{ include: { items: true } }>>> = [];
  let subscribers: { id: string; email: string; createdAt: Date }[] = [];
  let dbError: string | null = null;

  try {
    [products, orders, subscribers] = await Promise.all([
      prisma.product.findMany({
        include: {
          images: {
            orderBy: {
              position: "asc",
            },
          },
          variants: {
            orderBy: [{ size: "asc" }, { color: "asc" }],
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      }),
      prisma.order.findMany({
        include: {
          items: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.subscriber
        .findMany({
          orderBy: {
            createdAt: "desc",
          },
        })
        .catch(() => [] as { id: string; email: string; createdAt: Date }[]),
    ]);
  } catch (error) {
    console.error("[AdminPage] DB error:", error);
    dbError =
      error instanceof Error ? error.message : "Error desconocido al conectar con la base de datos.";
  }

  const colorFallback = Array.from(
    new Map(
      products
        .flatMap((product) => product.variants)
        .map((variant) => [
          variant.color,
          {
            id: variant.color,
            name: variant.color,
            hex: variant.colorHex,
            isActive: true,
          },
        ])
    ).values()
  );

  const colors = await prisma.color
    .findMany({
      orderBy: [{ isActive: "desc" }, { name: "asc" }],
    })
    .catch(() => colorFallback);

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-12 md:px-8 md:py-16">
      <div className="border border-black/10 bg-white/50 p-8 md:p-10">
        <p className="text-[10px] tracking-[0.32em] uppercase text-black/45">
          Bloomsy Admin
        </p>
        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-display text-4xl font-light md:text-5xl">
              Panel de control
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-black/60">
              Desde aqui Julieta puede cargar productos, ajustar inventario,
              revisar pedidos y ver la base de suscriptores.
            </p>
          </div>
          <p className="text-sm text-black/50">{session.user.email}</p>
        </div>
      </div>

      {dbError ? (
        <div className="mt-8 border border-red-200 bg-red-50 p-6 md:p-8">
          <p className="text-[10px] tracking-[0.28em] uppercase text-red-400">
            Error de base de datos
          </p>
          <p className="mt-3 text-sm font-medium text-red-700">
            No fue posible conectar con la base de datos. El panel esta en modo
            de solo lectura.
          </p>
          <p className="mt-2 font-mono text-xs text-red-500">{dbError}</p>
        </div>
      ) : null}

      <div className="mt-8">
        <AdminDashboard
          products={products.map((product) => ({
            id: product.id,
            name: product.name,
            slug: product.slug,
            category: product.category,
            price: product.price,
            originalPrice: product.originalPrice,
            description: product.description,
            care: product.care,
            images: product.images.map((image) => ({
              id: image.id,
              url: image.url,
              position: image.position,
            })),
            variants: product.variants.map((variant) => ({
              id: variant.id,
              size: variant.size,
              color: variant.color,
              colorHex: variant.colorHex,
              stock: variant.stock,
            })),
            isNew: product.isNew,
            isFeatured: product.isFeatured,
            isActive: product.isActive,
            updatedAt: product.updatedAt.toISOString(),
          }))}
          orders={orders.map((order) => ({
            id: order.id,
            orderNumber: order.orderNumber,
            status: order.status,
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            customerPhone: order.customerPhone,
            shippingType: order.shippingType,
            address: order.address,
            city: order.city,
            region: order.region,
            paymentMethod: order.paymentMethod,
            subtotal: order.subtotal,
            shipping: order.shipping,
            total: order.total,
            createdAt: order.createdAt.toISOString(),
            items: order.items.map((item) => ({
              id: item.id,
              name: item.name,
              size: item.size,
              color: item.color,
              price: item.price,
              quantity: item.quantity,
            })),
          }))}
          subscribers={subscribers.map((subscriber) => ({
            id: subscriber.id,
            email: subscriber.email,
            createdAt: subscriber.createdAt.toISOString(),
          }))}
          colors={colors.map((color) => ({
            id: color.id,
            name: color.name,
            hex: color.hex,
            isActive: color.isActive,
          }))}
        />
      </div>
    </section>
  );
}
