import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FitPlan Pro - Your Personal Fitness Training Plan Platform",
  description:
    "Personalized workout plans, expert guidance, and progress tracking - all in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}