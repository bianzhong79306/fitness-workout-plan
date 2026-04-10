"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
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
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/exercises", labelKey: "exercises", icon: Dumbbell },
  { href: "/plans", labelKey: "plans", icon: Dumbbell },
  { href: "/ai-plan", labelKey: "ai-plan", icon: Sparkles },
  { href: "/timers", labelKey: "timers", icon: Timer },
];

export function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoggedIn = status === "authenticated";

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const toggleLocale = () => {
    const newLocale = locale === "en" ? "zh" : "en";
    const currentPath = pathname;
    // 替换locale
    const newPath = currentPath.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Dumbbell className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">FitPlan Pro</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${
                pathname.includes(item.href)
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.labelKey.charAt(0).toUpperCase() + item.labelKey.slice(1)}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLocale}
            className="hidden md:flex"
          >
            <Globe className="h-4 w-4" />
          </Button>

          {isLoggedIn ? (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/pricing">
                <Button variant="ghost" size="sm">
                  <Crown className="h-4 w-4 mr-1" />
                  {locale === "zh" ? "会员" : "Membership"}
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <BarChart3 className="h-4 w-4 mr-1" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/calendar">
                <Button variant="ghost" size="sm">
                  <CalendarDays className="h-4 w-4 mr-1" />
                  {locale === "zh" ? "日历" : "Calendar"}
                </Button>
              </Link>
              <Link href="/community">
                <Button variant="ghost" size="sm">
                  <Users className="h-4 w-4 mr-1" />
                  {locale === "zh" ? "社区" : "Community"}
                </Button>
              </Link>
              <Avatar className="h-8 w-8">
                <AvatarImage src={session?.user?.image || ""} />
                <AvatarFallback>
                  {session?.user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Link href="/auth/signin" className="hidden md:block">
              <Button size="sm">Sign In</Button>
            </Link>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
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

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted"
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="h-4 w-4" />
                {item.labelKey.charAt(0).toUpperCase() + item.labelKey.slice(1)}
              </Link>
            ))}
            <div className="border-t border-border pt-2 mt-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={toggleLocale}
              >
                <Globe className="h-4 w-4 mr-2" />
                {locale === "en" ? "中文" : "English"}
              </Button>
              {isLoggedIn ? (
                <>
                  <Link
                    href="/pricing"
                    className="block"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button variant="ghost" className="w-full justify-start">
                      <Crown className="h-4 w-4 mr-2" />
                      {locale === "zh" ? "会员" : "Membership"}
                    </Button>
                  </Link>
                  <Link
                    href="/dashboard"
                    className="block"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button variant="ghost" className="w-full justify-start">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link
                    href="/calendar"
                    className="block"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button variant="ghost" className="w-full justify-start">
                      <CalendarDays className="h-4 w-4 mr-2" />
                      {locale === "zh" ? "日历" : "Calendar"}
                    </Button>
                  </Link>
                  <Link
                    href="/community"
                    className="block"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button variant="ghost" className="w-full justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      {locale === "zh" ? "社区" : "Community"}
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Link
                  href="/auth/signin"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button className="w-full">Sign In</Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}