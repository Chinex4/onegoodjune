import { z } from "zod";
export const inquiryTypes = [
  "Programs",
  "Partnership",
  "Speaking",
  "Others",
] as const;
const name = z
  .string()
  .trim()
  .min(1, "Please enter your name.")
  .max(80, "Use 80 characters or fewer.")
  .regex(/^[^\u0000-\u001f\u007f<>]+$/, "Please use a valid name.");
export const contactSchema = z.object({
  firstName: name,
  lastName: name,
  email: z.email("Please enter a valid email address.").trim().max(254),
  inquiryType: z.enum(inquiryTypes, {
    error: "Please select an inquiry type.",
  }),
  message: z
    .string()
    .trim()
    .min(10, "Please enter at least 10 characters.")
    .max(5000, "Please use 5,000 characters or fewer."),
  website: z.string().max(200).optional(),
});
export type ContactInput = z.infer<typeof contactSchema>;
