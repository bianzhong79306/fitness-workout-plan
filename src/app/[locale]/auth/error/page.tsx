import { setRequestLocale } from "next-intl/server";
export const runtime = "edge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Link } from "@/i18n/routing";

export default function AuthErrorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return <AuthErrorContent params={params} />;
}

async function AuthErrorContent({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isZh = locale === "zh";

  return (
    <div className="container py-16">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-2xl">
              {isZh ? "登录出错" : "Authentication Error"}
            </CardTitle>
            <p className="text-muted-foreground">
              {isZh
                ? "登录过程中发生错误，请重新尝试"
                : "An error occurred during authentication. Please try again."}
            </p>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <Link href="/auth/signin">
              <Button className="w-full">
                {isZh ? "重新登录" : "Try Again"}
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full">
                {isZh ? "返回首页" : "Back to Home"}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}