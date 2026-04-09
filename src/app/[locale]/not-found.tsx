import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return <NotFoundContent params={params} />;
}

async function NotFoundContent({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isZh = locale === "zh";

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">
        {isZh ? "页面未找到" : "Page Not Found"}
      </h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        {isZh
          ? "您访问的页面不存在或已被移除。"
          : "The page you're looking for doesn't exist or has been moved."}
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            {isZh ? "返回首页" : "Go Home"}
          </Link>
        </Button>
        <Button variant="outline" onClick={() => window.history.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {isZh ? "返回上一页" : "Go Back"}
        </Button>
      </div>
    </div>
  );
}