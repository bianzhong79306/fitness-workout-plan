"use client";

import { Link } from "@/i18n/routing";
import { Dumbbell } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const locale = useLocale();
  const t = useTranslations("footer");
  const navT = useTranslations("nav");

  return (
    <footer className="border-t border-border bg-muted/50">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center space-x-2">
              <Dumbbell className="h-6 w-6 text-primary" />
              <span className="font-bold">FitPlan Pro</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {locale === "zh"
                ? "您的私人健身训练计划平台。改变身体，改变生活。"
                : "Your personal fitness training plan platform. Transform your body, transform your life."}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="font-semibold">{locale === "zh" ? "快速链接" : "Quick Links"}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/exercises" className="hover:text-primary">
                  {navT("exercises")}
                </Link>
              </li>
              <li>
                <Link href="/plans" className="hover:text-primary">
                  {navT("plans")}
                </Link>
              </li>
              <li>
                <Link href="/timers" className="hover:text-primary">
                  {navT("timers")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h3 className="font-semibold">{locale === "zh" ? "资源" : "Resources"}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary">
                  {locale === "zh" ? "入门指南" : "Getting Started"}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  {locale === "zh" ? "常见问题" : "FAQ"}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  {locale === "zh" ? "联系我们" : "Contact Us"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h3 className="font-semibold">{locale === "zh" ? "法律" : "Legal"}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary">
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  {t("terms")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>© {currentYear} FitPlan Pro. {t("rights")}</p>
        </div>
      </div>
    </footer>
  );
}