import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1f2937" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "FitPlan Pro - Your Personal Fitness Training Plan Platform",
    template: "%s | FitPlan Pro",
  },
  description:
    "AI-powered personalized workout plans, expert guidance, and progress tracking - all in one place.",
  keywords: [
    "fitness",
    "workout",
    "training plan",
    "exercise",
    "health",
    "AI fitness",
    "gym",
    "strength training",
  ],
  authors: [{ name: "FitPlan Pro Team" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FitPlan Pro",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "FitPlan Pro",
    title: "FitPlan Pro - AI-Powered Fitness Training",
    description: "AI-powered personalized workout plans and progress tracking",
  },
  twitter: {
    card: "summary_large_image",
    title: "FitPlan Pro",
    description: "AI-powered personalized workout plans and progress tracking",
  },
  icons: {
    icon: [
      { url: "/icons/icon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icons/icon-192.svg", sizes: "180x180", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}