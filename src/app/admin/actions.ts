"use server";
import { redirect } from "next/navigation";
import {
  adminConfigured,
  endSession,
  passwordMatches,
  startSession,
} from "@/lib/admin-auth";
export async function login(
  _: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string }> {
  if (!adminConfigured())
    return { error: "Admin access is not configured on this server." };
  const password = String(formData.get("password") || "");
  if (!password || !passwordMatches(password)) {
    // Slow down guessing.
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { error: "That password is incorrect." };
  }
  await startSession();
  redirect("/admin");
}
export async function logout() {
  await endSession();
  redirect("/admin");
}
