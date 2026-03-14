import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de privacidad — Bloomsy",
  description:
    "Conoce cómo Bloomsy recopila, usa y protege tus datos personales.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-black/10 pt-8 pb-2">
      <h2 className="font-display text-[24px] md:text-[28px] font-light mb-4">{title}</h2>
      <div className="text-[14px] text-black/65 leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

export default function PrivacidadPage() {
  return (
    <main className="bg-bloomsy-cream min-h-screen">
      <div className="max-w-[860px] mx-auto px-4 md:px-8 py-14 md:py-20">

        <div className="mb-12">
          <p className="text-[10px] tracking-[0.35em] uppercase text-black/35 mb-4">Legal</p>
          <h1 className="font-display text-[48px] md:text-[64px] font-light leading-[1]">
            Política de privacidad
          </h1>
          <p className="mt-4 text-sm text-black/45">
            Última actualización: marzo 2026
          </p>
        </div>

        <div className="flex flex-col gap-10">

          <Section title="1. Responsable del tratamiento">
            <p>
              El responsable del tratamiento de tus datos personales es Bloomsy, con domicilio
              en Chile y correo electrónico de contacto{" "}
              <Link
                href="mailto:info@bloomsy.cl"
                className="text-bloomsy-black underline underline-offset-2 hover:text-black/60 transition-colors"
              >
                info@bloomsy.cl
              </Link>
              .
            </p>
          </Section>

          <Section title="2. Datos que recopilamos">
            <p>Recopilamos los siguientes tipos de datos personales:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                <strong className="text-black/80">Datos de contacto:</strong> nombre, email,
                teléfono, dirección de despacho.
              </li>
              <li>
                <strong className="text-black/80">Datos de compra:</strong> historial de pedidos,
                productos adquiridos, método de pago (sin datos bancarios completos).
              </li>
              <li>
                <strong className="text-black/80">Datos de navegación:</strong> dirección IP,
                tipo de dispositivo, páginas visitadas (a través de cookies analíticas).
              </li>
              <li>
                <strong className="text-black/80">Newsletter:</strong> dirección de email si te
                suscribes voluntariamente.
              </li>
            </ul>
          </Section>

          <Section title="3. Finalidad del tratamiento">
            <p>Utilizamos tus datos para:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Procesar y gestionar tus pedidos.</li>
              <li>Comunicarnos contigo sobre el estado de tu compra.</li>
              <li>Enviarte el newsletter si te suscribiste (puedes darte de baja en cualquier momento).</li>
              <li>Mejorar nuestro sitio web y experiencia de compra mediante análisis de uso.</li>
              <li>Cumplir con obligaciones legales y fiscales.</li>
            </ul>
          </Section>

          <Section title="4. Base legal del tratamiento">
            <p>
              El tratamiento de tus datos se basa en: (a) la ejecución del contrato de compraventa
              cuando realizas una compra; (b) tu consentimiento explícito cuando te suscribes al
              newsletter; y (c) nuestro interés legítimo en mejorar el servicio y prevenir fraudes.
            </p>
          </Section>

          <Section title="5. Conservación de los datos">
            <p>
              Conservamos tus datos personales durante el tiempo necesario para cumplir con las
              finalidades descritas y para dar cumplimiento a las obligaciones legales aplicables.
              Los datos de newsletter se conservan hasta que solicites la baja.
            </p>
          </Section>

          <Section title="6. Compartición de datos">
            <p>
              No vendemos ni cedemos tus datos personales a terceros. Compartimos información
              únicamente con proveedores de servicios necesarios para operar:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Starken (empresa de transporte) — para gestionar el despacho.</li>
              <li>Transbank / Webpay — para procesar pagos.</li>
              <li>Vercel y Supabase — infraestructura tecnológica del sitio.</li>
            </ul>
            <p>
              Estos proveedores actúan como encargados del tratamiento y están sujetos a
              obligaciones de confidencialidad.
            </p>
          </Section>

          <Section title="7. Tus derechos">
            <p>
              De acuerdo con la Ley N° 19.628 sobre Protección de la Vida Privada (Chile), tienes
              derecho a:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Acceder a tus datos personales que tenemos almacenados.</li>
              <li>Rectificar datos inexactos o desactualizados.</li>
              <li>Solicitar la eliminación de tus datos cuando ya no sean necesarios.</li>
              <li>Oponerte al tratamiento de tus datos con fines de marketing.</li>
            </ul>
            <p>
              Para ejercer cualquiera de estos derechos, escríbenos a{" "}
              <Link
                href="mailto:info@bloomsy.cl"
                className="text-bloomsy-black underline underline-offset-2 hover:text-black/60 transition-colors"
              >
                info@bloomsy.cl
              </Link>
              .
            </p>
          </Section>

          <Section title="8. Cookies">
            <p>
              Bloomsy utiliza cookies propias y de terceros para mejorar la experiencia de navegación,
              analizar el tráfico del sitio (Google Analytics / Vercel Analytics) y recordar tus
              preferencias. Puedes configurar tu navegador para rechazar cookies, aunque esto puede
              afectar la funcionalidad del sitio.
            </p>
          </Section>

          <Section title="9. Seguridad">
            <p>
              Implementamos medidas técnicas y organizativas adecuadas para proteger tus datos
              contra acceso no autorizado, pérdida o divulgación. Las transacciones de pago se
              procesan a través de plataformas certificadas (Transbank) y nunca almacenamos datos
              completos de tarjetas bancarias.
            </p>
          </Section>

          <Section title="10. Cambios en esta política">
            <p>
              Nos reservamos el derecho de actualizar esta política de privacidad. Te notificaremos
              de cambios significativos publicando la nueva versión en esta página con la fecha de
              actualización.
            </p>
          </Section>

          <Section title="11. Contacto">
            <p>
              Si tienes preguntas sobre esta política o sobre el tratamiento de tus datos, contáctanos:
            </p>
            <ul className="list-none space-y-1 ml-2">
              <li>
                Email:{" "}
                <Link
                  href="mailto:info@bloomsy.cl"
                  className="text-bloomsy-black underline underline-offset-2 hover:text-black/60 transition-colors"
                >
                  info@bloomsy.cl
                </Link>
              </li>
              <li>
                WhatsApp:{" "}
                <Link
                  href="https://wa.me/56992723158"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-bloomsy-black underline underline-offset-2 hover:text-black/60 transition-colors"
                >
                  +56 9 9272 3158
                </Link>
              </li>
            </ul>
          </Section>

        </div>
      </div>
    </main>
  );
}
