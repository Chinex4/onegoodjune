import { z } from "zod";
import { getProgram, programIds } from "./programs";
export const registrationSchema = z
  .object({
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
    bookTitle: z.string().trim().max(200).optional(),
    releaseDate: z.string().trim().max(60).optional(),
    website: z.string().max(200).optional(),
  })
  .superRefine((value, ctx) => {
    if (getProgram(value.program)?.requiresBook && !value.bookTitle)
      ctx.addIssue({
        code: "custom",
        path: ["bookTitle"],
        message: "Please enter your book's title.",
      });
  });
export type RegistrationInput = z.infer<typeof registrationSchema>;
