import { setRequestLocale } from "next-intl/server";
export const runtime = "edge";
import ExercisesClient from "./ExercisesClient";

export default function ExercisesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return <ExercisesPageContent params={params} />;
}

async function ExercisesPageContent({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ExercisesClient locale={locale} />;
}