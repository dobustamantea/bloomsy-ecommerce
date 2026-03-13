import type { Metadata } from "next";
import { auth } from "@/auth";
import AccountAuthForm from "@/components/account/AccountAuthForm";
import AccountSignOutButton from "@/components/account/AccountSignOutButton";
import { getDisplayName } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { formatCLP } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Mi cuenta",
  description: "Accede a tu cuenta Bloomsy y revisa tu historial de pedidos.",
};

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    return <AccountAuthForm />;
  }

  const orders = session.user.email
    ? await prisma.order.findMany({
        where: {
          customerEmail: {
            equals: session.user.email,
            mode: "insensitive",
          },
        },
        include: {
          items: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    : [];

  const displayName = getDisplayName(session.user.name, session.user.email);

  return (
    <section className="max-w-[1100px] mx-auto px-4 md:px-8 py-12 md:py-16">
      <div className="flex flex-col gap-6 border border-black/10 bg-white/40 p-8 md:flex-row md:items-end md:justify-between md:p-10">
        <div>
          <p className="text-[10px] tracking-[0.32em] uppercase text-black/45">
            Mi cuenta
          </p>
          <h1 className="mt-4 font-display text-4xl md:text-5xl font-light leading-none">
            {displayName}
          </h1>
          <p className="mt-4 text-sm text-black/60">{session.user.email}</p>
        </div>

        <AccountSignOutButton />
      </div>

      <div className="mt-8 border border-black/10 bg-bloomsy-cream p-6 md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-3xl font-light">
              Historial de ordenes
            </h2>
          </div>
          <p className="text-sm text-black/50">
            {orders.length} {orders.length === 1 ? "pedido" : "pedidos"} asociado
            {orders.length === 1 ? "" : "s"} a {session.user.email}
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="mt-8 border border-dashed border-black/15 px-6 py-10 text-sm leading-7 text-black/55">
            Todavia no encontramos compras con este email. Cuando hagas tu
            primer pedido, aparecera aqui.
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {orders.map((order) => (
              <article
                key={order.id}
                className="border border-black/10 bg-white/70 p-5 md:p-6"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-[10px] tracking-[0.24em] uppercase text-black/40">
                      Pedido
                    </p>
                    <h3 className="mt-2 text-lg font-medium text-bloomsy-black">
                      {order.orderNumber}
                    </h3>
                    <p className="mt-2 text-sm text-black/55">
                      {new Intl.DateTimeFormat("es-CL", {
                        dateStyle: "long",
                        timeStyle: "short",
                      }).format(order.createdAt)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className="border border-black/10 px-3 py-1 text-[10px] tracking-[0.22em] uppercase text-black/55">
                      {order.status}
                    </span>
                    <span className="font-display text-2xl font-medium">
                      {formatCLP(order.total)}
                    </span>
                  </div>
                </div>

                <div className="mt-5 border-t border-black/8 pt-5">
                  <p className="text-[10px] tracking-[0.24em] uppercase text-black/35">
                    Productos
                  </p>
                  <ul className="mt-4 space-y-3">
                    {order.items.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-start justify-between gap-4 text-sm"
                      >
                        <div>
                          <p className="text-bloomsy-black">{item.name}</p>
                          <p className="mt-1 text-black/50">
                            Talla {item.size} | {item.color} | Cantidad {item.quantity}
                          </p>
                        </div>
                        <span className="font-medium text-bloomsy-black">
                          {formatCLP(item.price * item.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
