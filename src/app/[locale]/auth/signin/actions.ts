"use server";

import { signIn } from "@/auth";

export async function handleGoogleSignIn(formData: FormData) {
  const locale = formData.get("locale") as string || "en";
  await signIn("google", { redirectTo: `/${locale}/dashboard` });
}