import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Términos y condiciones — Bloomsy",
  description:
    "Lee los términos y condiciones de uso de bloomsy.cl y de compra en nuestra tienda.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-black/10 pt-8 pb-2">
      <h2 className="font-display text-[24px] md:text-[28px] font-light mb-4">{title}</h2>
      <div className="text-[14px] text-black/65 leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

export default function TerminosPage() {
  return (
    <main className="bg-bloomsy-cream min-h-screen">
      <div className="max-w-[860px] mx-auto px-4 md:px-8 py-14 md:py-20">

        <div className="mb-12">
          <p className="text-[10px] tracking-[0.35em] uppercase text-black/35 mb-4">Legal</p>
          <h1 className="font-display text-[48px] md:text-[64px] font-light leading-[1]">
            Términos y condiciones
          </h1>
          <p className="mt-4 text-sm text-black/45">
            Última actualización: marzo 2026
          </p>
        </div>

        <div className="flex flex-col gap-10">

          <Section title="1. Aceptación de los términos">
            <p>
              Al acceder y utilizar bloomsy.cl, aceptas estar sujeto a estos Términos y Condiciones.
              Si no estás de acuerdo con alguna parte de los términos, no podrás acceder al servicio.
            </p>
            <p>
              Bloomsy se reserva el derecho de modificar estos términos en cualquier momento. Los cambios
              entrarán en vigencia al publicarse en el sitio web.
            </p>
          </Section>

          <Section title="2. Productos y precios">
            <p>
              Todos los precios publicados en bloomsy.cl están expresados en pesos chilenos (CLP) e
              incluyen IVA cuando corresponda. Bloomsy se reserva el derecho de modificar los precios
              sin previo aviso.
            </p>
            <p>
              Las imágenes de los productos son referenciales. Los colores pueden variar levemente
              según la pantalla de cada dispositivo.
            </p>
            <p>
              La disponibilidad de stock es en tiempo real. En caso de que un producto se agote después
              de realizado el pedido, te contactaremos para ofrecerte una alternativa o el reembolso
              correspondiente.
            </p>
          </Section>

          <Section title="3. Proceso de compra">
            <p>
              Para realizar una compra deberás completar el formulario de checkout con tus datos
              personales y de despacho. Al confirmar tu pedido, recibirás un número de orden único.
            </p>
            <p>
              El contrato de compraventa se perfecciona una vez que Bloomsy confirme la disponibilidad
              del producto y la recepción del pago. Nos reservamos el derecho de rechazar pedidos en
              casos de error de precio manifiesto o sospecha de fraude.
            </p>
          </Section>

          <Section title="4. Métodos de pago">
            <p>Bloomsy acepta los siguientes métodos de pago:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Webpay (débito, crédito y prepago) — procesado por Transbank</li>
              <li>Transferencia bancaria directa</li>
            </ul>
            <p>
              Para pagos por transferencia, el pedido se confirma una vez recibido y verificado el
              comprobante en info@bloomsy.cl.
            </p>
          </Section>

          <Section title="5. Envíos y despacho">
            <p>
              Despachamos a todo Chile vía Starken. El costo de envío es de $3.990 y es gratuito
              en compras sobre $50.000. Los plazos de entrega son de 3 a 5 días hábiles desde la
              confirmación del pedido.
            </p>
            <p>
              Para regiones extremas (Aysén, Magallanes, Isla de Pascua), los plazos pueden
              extenderse hasta 7–10 días hábiles. Para retiro presencial, el cliente debe
              coordinar directamente con Bloomsy vía WhatsApp.
            </p>
            <p>
              Bloomsy no se responsabiliza por demoras causadas por el transportista una vez
              despachado el pedido. En esos casos, el cliente puede hacer seguimiento directamente
              en starken.cl con el número de orden proporcionado.
            </p>
          </Section>

          <Section title="6. Cambios y devoluciones">
            <p>
              Aceptamos cambios y devoluciones hasta 30 días después de recibido el pedido. El
              producto debe estar sin uso, con etiquetas originales y en su empaque original.
            </p>
            <p>
              Para iniciar un cambio o devolución, escríbenos a info@bloomsy.cl o por WhatsApp
              indicando tu número de pedido y el motivo. Los gastos de envío del cambio corren
              por cuenta del cliente, salvo que el producto presente defectos de fabricación.
            </p>
          </Section>

          <Section title="7. Propiedad intelectual">
            <p>
              Todo el contenido del sitio bloomsy.cl —incluyendo textos, imágenes, logos y diseños—
              es propiedad de Bloomsy y está protegido por las leyes de propiedad intelectual
              aplicables en Chile. Queda prohibida su reproducción sin autorización expresa.
            </p>
          </Section>

          <Section title="8. Limitación de responsabilidad">
            <p>
              Bloomsy no será responsable por daños indirectos, incidentales o consecuentes que
              puedan surgir del uso del sitio o de los productos adquiridos. Nuestra responsabilidad
              total no excederá el monto pagado por el producto en cuestión.
            </p>
          </Section>

          <Section title="9. Ley aplicable">
            <p>
              Estos términos se rigen por las leyes de la República de Chile. Cualquier disputa
              será sometida a la jurisdicción de los tribunales competentes de la ciudad de
              Santiago, Chile.
            </p>
          </Section>

          <Section title="10. Contacto">
            <p>
              Para consultas sobre estos términos, puedes escribirnos a{" "}
              <Link
                href="mailto:info@bloomsy.cl"
                className="text-bloomsy-black underline underline-offset-2 hover:text-black/60 transition-colors"
              >
                info@bloomsy.cl
              </Link>{" "}
              o contactarnos por{" "}
              <Link
                href="https://wa.me/56992723158"
                target="_blank"
                rel="noopener noreferrer"
                className="text-bloomsy-black underline underline-offset-2 hover:text-black/60 transition-colors"
              >
                WhatsApp
              </Link>
              .
            </p>
          </Section>

        </div>
      </div>
    </main>
  );
}
