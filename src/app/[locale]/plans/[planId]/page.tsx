// 计划详情页

import { Metadata } from 'next';
import PlanDetailClient from './PlanDetailClient';

export const runtime = 'edge';

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Workout Plan - FitPlan Pro' };
}

export default async function PlanPage({ params }: { params: Promise<{ locale: string; planId: string }> }) {
  const { locale, planId } = await params;
  return <PlanDetailClient locale={locale} planId={planId} />;
}