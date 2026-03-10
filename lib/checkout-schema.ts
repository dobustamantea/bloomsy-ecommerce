import { z } from "zod";

const phoneRegex = /^(\+56\s?9|\+569|09)\s?\d{4}\s?\d{4}$/;

export const checkoutSchema = z
  .object({
    // Contact
    name: z.string().min(3, "Ingresa tu nombre completo"),
    email: z.string().email("Ingresa un email válido"),
    phone: z
      .string()
      .regex(phoneRegex, "Formato: +56 9 XXXX XXXX"),

    // Delivery
    deliveryType: z.enum(["delivery", "pickup"]),
    address: z.string().optional(),
    apartment: z.string().optional(),
    city: z.string().optional(),
    region: z.string().optional(),
    postalCode: z.string().optional(),

    // Payment
    paymentMethod: z.enum(["webpay", "transfer"]),
  })
  .superRefine((data, ctx) => {
    if (data.deliveryType === "delivery") {
      if (!data.address?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Ingresa tu dirección",
          path: ["address"],
        });
      }
      if (!data.city?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Ingresa tu ciudad",
          path: ["city"],
        });
      }
      if (!data.region?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Selecciona tu región",
          path: ["region"],
        });
      }
    }
  });

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export const CHILEAN_REGIONS = [
  "Arica y Parinacota",
  "Tarapacá",
  "Antofagasta",
  "Atacama",
  "Coquimbo",
  "Valparaíso",
  "Región Metropolitana",
  "O'Higgins",
  "Maule",
  "Ñuble",
  "Biobío",
  "La Araucanía",
  "Los Ríos",
  "Los Lagos",
  "Aysén",
  "Magallanes",
] as const;
