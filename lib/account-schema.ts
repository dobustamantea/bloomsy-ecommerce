import { z } from "zod";

export const chileanRegions = [
  "Arica y Parinacota",
  "Tarapaca",
  "Antofagasta",
  "Atacama",
  "Coquimbo",
  "Valparaiso",
  "Region Metropolitana",
  "O'Higgins",
  "Maule",
  "Nuble",
  "Biobio",
  "La Araucania",
  "Los Rios",
  "Los Lagos",
  "Aysen",
  "Magallanes",
] as const;

export const phoneRegex = /^(\+56\s?9|\+569|09)\s?\d{4}\s?\d{4}$/;

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Ingresa tu nombre.")
    .max(80, "El nombre es demasiado largo."),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Usa el formato +56 9 XXXX XXXX.")
    .or(z.literal("")),
});

export const addressSchema = z.object({
  label: z
    .string()
    .trim()
    .min(2, "Agrega un nombre para esta direccion.")
    .max(40, "El nombre es demasiado largo."),
  recipientName: z
    .string()
    .trim()
    .min(2, "Ingresa el nombre de quien recibe.")
    .max(80, "El nombre es demasiado largo."),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Usa el formato +56 9 XXXX XXXX.")
    .or(z.literal("")),
  line1: z
    .string()
    .trim()
    .min(5, "Ingresa la direccion principal.")
    .max(120, "La direccion es demasiado larga."),
  line2: z
    .string()
    .trim()
    .max(120, "La referencia es demasiado larga.")
    .optional()
    .or(z.literal("")),
  city: z
    .string()
    .trim()
    .min(2, "Ingresa la comuna o ciudad.")
    .max(80, "La comuna o ciudad es demasiado larga."),
  region: z
    .string()
    .trim()
    .min(2, "Selecciona una region.")
    .max(80, "La region es demasiado larga."),
  postalCode: z
    .string()
    .trim()
    .max(20, "El codigo postal es demasiado largo.")
    .optional()
    .or(z.literal("")),
  isDefault: z.boolean().optional().default(false),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
export type AddressFormValues = z.infer<typeof addressSchema>;
