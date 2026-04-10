'use client';

import { useState } from 'react';
import { Link } from '@/i18n/routing';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowRight, Crown, Tag } from 'lucide-react';
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

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-6 h-6 text-primary" />
          <h1 className="text-3xl font-bold">
            {isZh ? '训练知识库' : 'Training Knowledge Base'}
          </h1>
        </div>
        <p className="text-muted-foreground">
          {isZh
            ? '学习正确的训练原理和方法，让你的健身更科学、更有效'
            : 'Learn proper training principles and methods for more scientific and effective fitness'}
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Button
          variant={selectedCategory === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory(null)}
        >
          {isZh ? '全部' : 'All'}
        </Button>
        {Object.entries(categories).map(([key, value]) => (
          <Button
            key={key}
            variant={selectedCategory === key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(key)}
          >
            {isZh ? value.zh : value.en}
          </Button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <Link key={article.id} href={`/knowledge/${article.slug}`}>
            <Card className="h-full hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer group">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">
                    {isZh ? article.categoryZh : article.categoryEn}
                  </Badge>
                  {article.isPremium && (
                    <Badge variant="default" className="gap-1">
                      <Crown className="w-3 h-3" />
                      {isZh ? 'Pro' : 'Pro'}
                    </Badge>
                  )}
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">
                  {isZh ? article.title : article.titleEn}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {isZh ? article.summary : article.summaryEn}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1 mb-4">
                  {article.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      <Tag className="w-2 h-2 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {article.createdAt}
                  </span>
                  <span className="text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                    {isZh ? '阅读全文' : 'Read More'}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {filteredArticles.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          {isZh ? '暂无该分类的文章' : 'No articles in this category'}
        </div>
      )}

      {/* Learning Tip */}
      <div className="mt-12">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-1">
                  {isZh ? '💡 知识库持续更新中' : '💡 Knowledge Base Growing'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isZh
                    ? '我们正在不断添加新的训练知识文章。Pro会员可以访问更多专业内容。'
                    : 'We\'re constantly adding new training knowledge articles. Pro members can access more professional content.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}