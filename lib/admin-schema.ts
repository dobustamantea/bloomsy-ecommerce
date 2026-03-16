import { z } from "zod";

export const adminProductCategories = [
  "poleras",
  "tops",
  "camisas",
  "blusas",
  "faldas",
  "abrigos",
  "pantalones",
  "bodys",
  "chalecos",
  "conjuntos",
] as const;

const variantSchema = z.object({
  size: z.string().trim().min(1, "La talla es obligatoria."),
  color: z.string().trim().min(1, "El color es obligatorio."),
  colorHex: z
    .string()
    .trim()
    .regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, "Ingresa un color HEX valido."),
  stock: z.coerce.number().int().min(0, "El stock no puede ser negativo."),
});

export const adminProductSchema = z.object({
  name: z.string().trim().min(2, "El nombre es obligatorio."),
  slug: z
    .string()
    .trim()
    .min(2, "El slug es obligatorio.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Usa minusculas, numeros y guiones."),
  category: z.enum(adminProductCategories),
  price: z.coerce.number().int().min(0, "El precio debe ser mayor o igual a 0."),
  originalPrice: z
    .union([z.coerce.number().int().min(0), z.literal(""), z.null()])
    .transform((value) => (value === "" || value === null ? null : value)),
  description: z.string().trim().min(10, "La descripcion es demasiado corta."),
  care: z.array(z.string().trim().min(1)).min(1, "Agrega al menos un cuidado."),
  images: z.array(z.string().trim().url("Ingresa URLs validas.")).min(1, "Agrega al menos una imagen."),
  variants: z.array(variantSchema).min(1, "Agrega al menos una variante."),
  isNew: z.boolean(),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
});

export const adminOrderStatusSchema = z.object({
  status: z.enum([
    "pending",
    "confirmed",
    "paid",
    "preparing",
    "shipped",
    "delivered",
    "cancelled",
  ]),
  trackingNumber: z.string().trim().optional(),
});

export const adminOrderStatuses = adminOrderStatusSchema.shape.status.options;

export const adminColorSchema = z.object({
  name: z.string().trim().min(2, "El nombre es obligatorio."),
  hex: z
    .string()
    .trim()
    .regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, "Ingresa un color HEX valido."),
  isActive: z.boolean(),
});
