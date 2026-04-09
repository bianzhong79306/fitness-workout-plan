// AI 计划生成页面

import { Metadata } from 'next';
import AIPlanGeneratorClient from './AIPlanGeneratorClient';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'FitPlan Pro - AI Workout Plan Generator',
    description: 'Generate personalized workout plans with AI',
  };
}

export default async function AIPlanPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <AIPlanGeneratorClient locale={locale} />;
}