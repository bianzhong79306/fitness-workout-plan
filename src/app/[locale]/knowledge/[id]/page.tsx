import { setRequestLocale } from "next-intl/server";
export const runtime = "edge";
import { getArticleBySlug, KNOWLEDGE_CATEGORIES } from "@/data/knowledge-articles";
import { notFound } from "next/navigation";
import { ArticleClient } from "./ArticleClient";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const article = getArticleBySlug(id);
  if (!article) {
    notFound();
  }

  const categories = KNOWLEDGE_CATEGORIES;

  return <ArticleClient locale={locale} article={article} categories={categories} />;
}