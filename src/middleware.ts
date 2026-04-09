import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

// 需要保护的路由路径模式
const protectedRoutePatterns = [
  /^\/(en|zh)\/dashboard/,
  /^\/(en|zh)\/workout/,
  /^\/(en|zh)\/progress/,
];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // 检查是否是受保护的路由
  const isProtectedRoute = protectedRoutePatterns.some(
    (pattern) => pattern.test(pathname)
  );

  // 未登录访问受保护路由，重定向到登录页
  if (isProtectedRoute && !session?.user) {
    const locale = pathname.split("/")[1] || "en";
    const signInUrl = new URL(`/${locale}/auth/signin`, req.url);
    // 保存原始URL以便登录后跳转
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // 国际化处理
  return intlMiddleware(req);
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};