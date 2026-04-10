import { setRequestLocale } from "next-intl/server";
export const runtime = "edge";
import { KNOWLEDGE_ARTICLES, KNOWLEDGE_CATEGORIES } from "@/data/knowledge-articles";
import { KnowledgeClient } from "./KnowledgeClient";

export default async function KnowledgePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const articles = KNOWLEDGE_ARTICLES;
  const categories = KNOWLEDGE_CATEGORIES;

  return <KnowledgeClient locale={locale} articles={articles} categories={categories} />;
}