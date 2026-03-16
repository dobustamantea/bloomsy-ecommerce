import { z } from "zod";

const emailSchema = z.string().trim().min(1, "El email es obligatorio.").email(
  "Ingresa un email valido."
);

export const credentialsSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(8, "La contrasena debe tener al menos 8 caracteres.")
    .max(72, "La contrasena es demasiado larga."),
});

export const registerSchema = credentialsSchema.extend({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(80, "El nombre es demasiado largo."),
});

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function getDisplayName(name: string | null | undefined, email?: string | null) {
  if (name?.trim()) {
    return name.trim();
  }

  if (email) {
    return email.split("@")[0];
  }

  return "Mi cuenta";
}
