"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Home,
  Dumbbell,
  Timer,
  BarChart3,
  User,
  LogOut,
  Menu,
  X,
  Globe,
  Crown,
  Sparkles,
  CalendarDays,
  Users,
  Flame,
  Zap,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/", labelKey: "home", icon: Home, special: true },
  { href: "/exercises", labelKey: "exercises", icon: Dumbbell },
  { href: "/knowledge", labelKey: "knowledge", icon: Sparkles },
  { href: "/plans", labelKey: "plans", icon: Flame },
  { href: "/ai-plan", labelKey: "aiPlan", icon: Zap },
  { href: "/timers", labelKey: "timers", icon: Timer },
];

export function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("nav");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoggedIn = status === "authenticated";

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const toggleLocale = () => {
    const newLocale = locale === "en" ? "zh" : "en";
    const currentPath = pathname;
    const newPath = currentPath.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === `/${locale}` || pathname === `/${locale}/`;
    return pathname.includes(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-gradient-to-r from-white via-green-50/30 to-blue-50/30 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo - 活力风格 */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg blur opacity-50 group-hover:opacity-75 transition-opacity" />
            <Dumbbell className="relative h-7 w-7 text-green-600 group-hover:text-green-500 transition-colors" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent group-hover:from-green-500 group-hover:to-blue-500 transition-all">
            FitPlan Pro
          </span>
        </Link>

        {/* Desktop Navigation - 活力按钮 */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                isActive(item.href)
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30 nav-active"
                  : "hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 text-slate-700 hover:text-green-600 dark:text-slate-300 dark:hover:text-green-400"
              }`}
            >
              <item.icon className={`h-4 w-4 ${isActive(item.href) ? "animate-pulse" : ""}`} />
              <span>{item.href === "/" ? (locale === "zh" ? "主页" : "Home") : t(item.labelKey)}</span>
              {item.special && !isActive(item.href) && (
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full animate-ping" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Language Toggle - 圆形按钮 */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLocale}
            className="hidden md:flex rounded-full hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 hover:text-green-600 transition-all"
          >
            <Globe className="h-4 w-4" />
          </Button>

          {isLoggedIn ? (
            <div className="hidden md:flex items-center gap-1">
              <Link href="/pricing">
                <Button variant="ghost" size="sm" className="gap-1 rounded-full hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 hover:text-orange-600">
                  <Crown className="h-4 w-4 text-orange-500" />
                  <span>{locale === "zh" ? "会员" : "Pro"}</span>
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-1 rounded-full hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600">
                  <BarChart3 className="h-4 w-4" />
                  <span>{t("dashboard")}</span>
                </Button>
              </Link>
              <Link href="/calendar">
                <Button variant="ghost" size="sm" className="gap-1 rounded-full hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-600">
                  <CalendarDays className="h-4 w-4" />
                  <span>{locale === "zh" ? "日历" : "Calendar"}</span>
                </Button>
              </Link>
              <Link href="/community">
                <Button variant="ghost" size="sm" className="gap-1 rounded-full hover:bg-gradient-to-r hover:from-cyan-50 hover:to-teal-50 hover:text-cyan-600">
                  <Users className="h-4 w-4" />
                  <span>{locale === "zh" ? "社区" : "Community"}</span>
                </Button>
              </Link>
              <div className="relative ml-2">
                <Avatar className="h-8 w-8 ring-2 ring-green-500/30 ring-offset-2 ring-offset-background hover:ring-green-500 transition-all cursor-pointer">
                  <AvatarImage src={session?.user?.image || ""} />
                  <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                    {session?.user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleSignOut}
                className="rounded-full hover:bg-red-50 hover:text-red-600 transition-all"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Link href="/auth/signin" className="hidden md:block">
              <Button size="sm" className="energy-button rounded-full px-6">
                <Flame className="h-4 w-4 mr-1" />
                {t("signIn")}
              </Button>
            </Link>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-full hover:bg-green-50 hover:text-green-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation - 活力样式 */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/50 bg-gradient-to-b from-white to-green-50/20 dark:from-slate-900 dark:to-slate-800 slide-in-up">
          <nav className="container py-4 space-y-1">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive(item.href)
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md"
                    : "hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50"
                }`}
                onClick={() => setMobileMenuOpen(false)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.href === "/" ? (locale === "zh" ? "主页" : "Home") : t(item.labelKey)}</span>
              </Link>
            ))}
            <div className="border-t border-border/50 pt-3 mt-3 space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
                onClick={toggleLocale}
              >
                <Globe className="h-4 w-4 mr-3" />
                {locale === "en" ? "中文" : "English"}
              </Button>
              {isLoggedIn ? (
                <>
                  <Link href="/pricing" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start rounded-xl hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50">
                      <Crown className="h-4 w-4 mr-3 text-orange-500" />
                      {locale === "zh" ? "会员" : "Membership"}
                    </Button>
                  </Link>
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50">
                      <BarChart3 className="h-4 w-4 mr-3" />
                      {t("dashboard")}
                    </Button>
                  </Link>
                  <Link href="/calendar" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50">
                      <CalendarDays className="h-4 w-4 mr-3" />
                      {locale === "zh" ? "日历" : "Calendar"}
                    </Button>
                  </Link>
                  <Link href="/community" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start rounded-xl hover:bg-gradient-to-r hover:from-cyan-50 hover:to-teal-50">
                      <Users className="h-4 w-4 mr-3" />
                      {locale === "zh" ? "社区" : "Community"}
                    </Button>
                  </Link>
                  <Button variant="ghost" className="w-full justify-start rounded-xl hover:bg-red-50 hover:text-red-600" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-3" />
                    {t("signOut")}
                  </Button>
                </>
              ) : (
                <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full energy-button rounded-xl">
                    <Flame className="h-4 w-4 mr-2" />
                    {t("signIn")}
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}