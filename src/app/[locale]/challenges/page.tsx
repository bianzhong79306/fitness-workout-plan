// Challenges Page - 挑战赛列表页

import { setRequestLocale } from "next-intl/server";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ChallengesClient } from "./ChallengesClient";

export const runtime = "edge";

export default async function ChallengesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user) {
    redirect(`/${locale}/auth/signin`);
  }

  return <ChallengesClient locale={locale} />;
}