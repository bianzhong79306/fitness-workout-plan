import { Link } from "@/i18n/routing";
import { Dumbbell } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

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
              Your personal fitness training plan platform. Transform your body,
              transform your life.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/exercises" className="hover:text-primary">
                  Exercise Library
                </Link>
              </li>
              <li>
                <Link href="/plans" className="hover:text-primary">
                  Workout Plans
                </Link>
              </li>
              <li>
                <Link href="/timers" className="hover:text-primary">
                  Timers
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h3 className="font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary">
                  Getting Started
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h3 className="font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>© {currentYear} FitPlan Pro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}