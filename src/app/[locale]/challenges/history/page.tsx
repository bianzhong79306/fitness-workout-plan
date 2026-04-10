// Challenge History Page - 挑战历史页

import { setRequestLocale } from "next-intl/server";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ChallengeHistoryClient } from "./ChallengeHistoryClient";

export const runtime = "edge";

export default async function ChallengeHistoryPage({
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

  return <ChallengeHistoryClient locale={locale} />;
}