import { z } from "zod";
import { programIds } from "./programs";
export const registrationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(120, "Use 120 characters or fewer.")
    .regex(/^[^\u0000-\u001f\u007f<>]+$/, "Please use a valid name."),
  email: z.email("Please enter a valid email address.").trim().max(254),
  phone: z
    .string()
    .trim()
    .regex(
      /^\+?[0-9][0-9\s()-]{6,19}$/,
      "Please enter a valid phone number, e.g. +234 801 234 5678.",
    ),
  program: z.enum(programIds, { error: "Please choose a plan." }),
  website: z.string().max(200).optional(),
});
export type RegistrationInput = z.infer<typeof registrationSchema>;
