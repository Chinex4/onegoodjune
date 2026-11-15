"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteComment, setCommentHidden } from "@/lib/engagement";
import { ADMIN_PATH } from "@/lib/admin-path";
import {
  isAdmin,
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
  redirect(ADMIN_PATH);
}
export async function logout() {
  await endSession();
  redirect(ADMIN_PATH);
}
export async function moderateComment(formData: FormData) {
  if (!(await isAdmin())) redirect(ADMIN_PATH);
  const id = String(formData.get("id") || "");
  const action = String(formData.get("action") || "");
  if (action === "hide") await setCommentHidden(id, true);
  else if (action === "show") await setCommentHidden(id, false);
  else if (action === "delete") await deleteComment(id);
  revalidatePath(ADMIN_PATH);
}
