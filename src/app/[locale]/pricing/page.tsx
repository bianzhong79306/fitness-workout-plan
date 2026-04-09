// 会员定价页面

import { Metadata } from 'next';
import PricingPageClient from './PricingPageClient';

export const runtime = 'edge';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'FitPlan Pro - Membership Pricing',
    description: 'Choose the right membership plan for your fitness journey',
  };
}

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <PricingPageClient locale={locale} />;
}