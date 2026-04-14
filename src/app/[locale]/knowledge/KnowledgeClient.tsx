'use client';

import { useState } from 'react';
import { Link } from '@/i18n/routing';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowRight, Crown, Tag, Sparkles, Brain, Target, Activity } from 'lucide-react';
import type { KnowledgeArticle } from '@/data/knowledge-articles';

interface KnowledgeClientProps {
  locale: string;
  articles: KnowledgeArticle[];
  categories: Record<string, { zh: string; en: string }>;
}

export function KnowledgeClient({ locale, articles, categories }: KnowledgeClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const isZh = locale === 'zh';

  const filteredArticles = selectedCategory
    ? articles.filter(a => a.category === selectedCategory)
    : articles;

  const categoryIcons: Record<string, any> = {
    'training_principle': Target,
    'periodization': Activity,
    'population_guide': Brain,
    'specialized': Sparkles,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero 区域 */}
      <div className="relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl" />
        
        <div className="container relative z-10 py-12 md:py-16">
          {/* 标题 */}
          <div className="text-center mb-8 slide-in-up">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
              <BookOpen className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-400">
                {isZh ? '科学训练 · 专业知识' : 'Scientific Training · Professional Knowledge'}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              {isZh ? '训练知识库' : 'Training Knowledge Base'}
            </h1>
            
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              {isZh
                ? '深入理解训练原理，掌握科学方法，让你的健身真正有效'
                : 'Deep understanding of training principles, master scientific methods, make your fitness truly effective'}
            </p>
            
            {/* 统计 */}
            <div className="flex flex-wrap gap-4 justify-center mt-6">
              <div className="stats-card px-6 py-3 rounded-full">
                <span className="font-bold text-purple-600">{articles.length}</span>
                <span className="text-sm ml-2 text-slate-600">{isZh ? '篇文章' : 'Articles'}</span>
              </div>
              <div className="stats-card px-6 py-3 rounded-full">
                <span className="font-bold text-pink-600">{Object.keys(categories).length}</span>
                <span className="text-sm ml-2 text-slate-600">{isZh ? '个分类' : 'Categories'}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* 波浪分隔 */}
        <svg viewBox="0 0 1440 60" className="w-full h-12">
          <path d="M0 30 Q360 60, 720 30 T1440 30 V60 H0 Z" className="fill-white dark:fill-slate-900" />
        </svg>
      </div>

      {/* 主内容区 */}
      <div className="bg-white dark:bg-slate-900">
        <div className="container py-8">
          {/* 分类筛选 */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className={selectedCategory === null ? 'energy-button rounded-full' : 'rounded-full hover:bg-purple-50'}
            >
              <Sparkles className="w-4 h-4 mr-1" />
              {isZh ? '全部' : 'All'}
            </Button>
            {Object.entries(categories).map(([key, value]) => {
              const IconComponent = categoryIcons[key];
              return (
                <Button
                  key={key}
                  variant={selectedCategory === key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(key)}
                  className={selectedCategory === key ? 'energy-button rounded-full' : 'rounded-full hover:bg-purple-50'}
                >
                  {IconComponent && <IconComponent className="w-4 h-4 mr-1" />}
                  {isZh ? value.zh : value.en}
                </Button>
              );
            })}
          </div>

          {/* 文章网格 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article, idx) => (
              <Link key={article.id} href={`/knowledge/${article.slug}`}>
                <div 
                  className="knowledge-card sport-card-click cursor-pointer group h-full"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  {/* 分类和Pro标签 */}
                  <div className="flex items-center justify-between mb-3">
                    <Badge className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20 rounded-full px-3">
                      {(() => {
                        const IconComponent = categoryIcons[article.category];
                        return IconComponent ? <IconComponent className="w-3 h-3 mr-1" /> : null;
                      })()}
                      {isZh ? article.categoryZh : article.categoryEn}
                    </Badge>
                    {article.isPremium && (
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full px-2 py-0.5 text-xs gap-1">
                        <Crown className="w-3 h-3" />
                        Pro
                      </Badge>
                    )}
                  </div>
                  
                  {/* 标题 */}
                  <h3 className="text-xl font-bold mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                    {isZh ? article.title : article.titleEn}
                  </h3>
                  
                  {/* 摘要 */}
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-3">
                    {isZh ? article.summary : article.summaryEn}
                  </p>
                  
                  {/* 标签 */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {article.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs rounded-full border-purple-500/20 text-purple-600">
                        <Tag className="w-2 h-2 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* 底部 */}
                  <div className="flex items-center justify-between text-sm pt-4 border-t border-slate-200/50">
                    <span className="text-slate-400">
                      {article.createdAt}
                    </span>
                    <span className="flex items-center gap-1 text-purple-600 font-medium group-hover:text-purple-500 group-hover:gap-2 transition-all">
                      {isZh ? '阅读全文' : 'Read More'}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* 空状态 */}
          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 mx-auto text-slate-400 mb-4" />
              <p className="text-slate-500">{isZh ? '暂无该分类的文章' : 'No articles in this category'}</p>
            </div>
          )}
        </div>
      </div>

      {/* 提示卡片 */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-800">
        <div className="container py-8">
          <div className="sport-card p-6 flex items-center gap-6 flex-wrap justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
              <Brain className="w-8 h-8 text-white animate-pulse" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="font-bold text-lg mb-1 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {isZh ? '💡 知识库持续更新中' : '💡 Knowledge Base Growing'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {isZh
                  ? '每周添加新文章。Pro会员可访问全部专业内容。'
                  : 'New articles weekly. Pro members access all professional content.'}
              </p>
            </div>
            <Link href="/pricing">
              <Button className="energy-button rounded-full px-6">
                <Crown className="w-4 h-4 mr-2" />
                {isZh ? '升级Pro' : 'Upgrade Pro'}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}