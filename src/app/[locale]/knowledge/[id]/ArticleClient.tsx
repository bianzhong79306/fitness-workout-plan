'use client';

import { Link } from '@/i18n/routing';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Crown, Dumbbell, Tag } from 'lucide-react';
import type { KnowledgeArticle } from '@/data/knowledge-articles';

interface ArticleClientProps {
  locale: string;
  article: KnowledgeArticle;
  categories: Record<string, { zh: string; en: string }>;
}

export function ArticleClient({ locale, article, categories }: ArticleClientProps) {
  const isZh = locale === 'zh';
  const categoryName = isZh
    ? categories[article.category]?.zh || article.categoryZh
    : categories[article.category]?.en || article.categoryEn;

  // Simple Markdown renderer (basic implementation)
  const renderMarkdown = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => {
        // Headers
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-2xl font-bold mb-4">{line.slice(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-xl font-semibold mb-3 mt-6">{line.slice(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-lg font-medium mb-2 mt-4">{line.slice(4)}</h3>;
        }

        // Bold
        if (line.includes('**')) {
          const parts = line.split(/\*\*(.*?)\*\*/);
          return (
            <p key={index} className="mb-2">
              {parts.map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part)}
            </p>
          );
        }

        // Lists
        if (line.startsWith('- ') || line.startsWith('* ')) {
          return <li key={index} className="ml-4 mb-1">{line.slice(2)}</li>;
        }

        // Check marks
        if (line.startsWith('- ❌') || line.startsWith('- ✅')) {
          return (
            <li key={index} className="ml-4 mb-1 flex items-center gap-2">
              {line.startsWith('- ✅') ? (
                <span className="text-green-500">✅</span>
              ) : (
                <span className="text-red-500">❌</span>
              )}
              {line.slice(4)}
            </li>
          );
        }

        // Tables (basic)
        if (line.startsWith('|')) {
          const cells = line.split('|').filter(c => c.trim());
          if (line.includes('---')) {
            return null; // Skip separator
          }
          return (
            <div key={index} className="grid grid-cols-2 gap-2 mb-1 py-1 border-b">
              {cells.map((cell, i) => (
                <span key={i} className={i === 0 ? 'font-medium' : 'text-muted-foreground'}>
                  {cell.trim()}
                </span>
              ))}
            </div>
          );
        }

        // Empty lines
        if (!line.trim()) {
          return <br key={index} />;
        }

        // Regular text
        return <p key={index} className="mb-2">{line}</p>;
      });
  };

  return (
    <div className="container py-8 max-w-4xl">
      {/* Back Button */}
      <Link href="/knowledge">
        <Button variant="ghost" size="sm" className="mb-6 gap-2">
          <ArrowLeft className="w-4 h-4" />
          {isZh ? '返回知识库' : 'Back to Knowledge Base'}
        </Button>
      </Link>

      {/* Article Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary">{categoryName}</Badge>
          {article.isPremium && (
            <Badge variant="default" className="gap-1">
              <Crown className="w-3 h-3" />
              Pro
            </Badge>
          )}
        </div>
        <h1 className="text-3xl font-bold mb-4">
          {isZh ? article.title : article.titleEn}
        </h1>
        <p className="text-muted-foreground text-lg">
          {isZh ? article.summary : article.summaryEn}
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          {article.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="gap-1">
              <Tag className="w-3 h-3" />
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Article Content */}
      <Card className="mb-8">
        <CardContent className="py-6">
          <div className="prose prose-neutral max-w-none">
            {renderMarkdown(isZh ? article.content : article.contentEn)}
          </div>
        </CardContent>
      </Card>

      {/* Related Exercises */}
      {article.relatedExercises.length > 0 && (
        <Card className="mb-8 bg-muted/30">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Dumbbell className="w-5 h-5 text-primary" />
              <h3 className="font-medium">
                {isZh ? '相关动作推荐' : 'Related Exercises'}
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {article.relatedExercises.map((exId) => (
                <Link key={exId} href={`/exercises/${exId}`}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Dumbbell className="w-3 h-3" />
                    {exId}
                  </Button>
                </Link>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              {isZh
                ? '点击查看相关动作的详细教学'
                : 'Click to view detailed instructions for related exercises'}
            </p>
          </Card>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/exercises" className="flex-1">
          <Button variant="outline" className="w-full gap-2">
            <Dumbbell className="w-4 h-4" />
            {isZh ? '浏览动作百科' : 'Browse Exercise Library'}
          </Button>
        </Link>
        <Link href="/knowledge" className="flex-1">
          <Button className="w-full gap-2">
            <BookOpen className="w-4 h-4" />
            {isZh ? '更多知识文章' : 'More Articles'}
          </Button>
        </Link>
      </div>
    </div>
  );
}