// Challenge Detail Page - 挑战详情页

import { setRequestLocale } from "next-intl/server";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ChallengeDetailClient } from "./ChallengeDetailClient";

export const runtime = "edge";

export default async function ChallengeDetailPage({
  params,
}: {
  params: Promise<{ locale: string; challengeId: string }>;
}) {
  const { locale, challengeId } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user) {
    redirect(`/${locale}/auth/signin`);
  }

  return <ChallengeDetailClient locale={locale} challengeId={challengeId} />;
}