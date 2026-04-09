// 训练计划列表页 - 服务器组件

import { setRequestLocale } from "next-intl/server";
import PlansClient from "./PlansClient";

export const runtime = "edge";

export default async function PlansPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PlansClient locale={locale} />;
}