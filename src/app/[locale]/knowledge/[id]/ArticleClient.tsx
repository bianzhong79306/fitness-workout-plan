'use client';

import { Link } from '@/i18n/routing';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Crown, Dumbbell, Tag } from 'lucide-react';
import type { KnowledgeArticle } from '@/data/knowledge-articles';
import React from 'react';

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

  // Enhanced Markdown renderer
  const renderMarkdown = (content: string) => {
    const lines = content.split('\n');
    const result: React.ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Skip empty lines
      if (!line.trim()) {
        i++;
        continue;
      }

      // Image: ![alt](url)
      const imgMatch = line.match(/^!\[(.*?)\]\((.*?)\)$/);
      if (imgMatch) {
        result.push(
          <figure key={i} className="my-8 flex flex-col items-center">
            <img
              src={imgMatch[2]}
              alt={imgMatch[1]}
              className="rounded-xl shadow-lg object-cover max-w-full h-auto"
            />
            {imgMatch[1] && (
              <figcaption className="text-center text-sm text-muted-foreground mt-3">
                {imgMatch[1]}
              </figcaption>
            )}
          </figure>
        );
        i++;
        continue;
      }

      // Table
      if (line.startsWith('|')) {
        const tableLines: string[] = [];
        while (i < lines.length && lines[i].startsWith('|')) {
          tableLines.push(lines[i]);
          i++;
        }
        result.push(renderTable(tableLines));
        continue;
      }

      // Headers
      if (line.startsWith('# ')) {
        result.push(
          <h1 key={i} className="text-3xl font-bold mb-6 mt-8 text-primary scroll-m-20">
            {renderInline(line.slice(2))}
          </h1>
        );
        i++;
        continue;
      }
      if (line.startsWith('## ')) {
        result.push(
          <h2 key={i} className="text-2xl font-semibold mb-4 mt-8 pb-2 border-b">
            {renderInline(line.slice(3))}
          </h2>
        );
        i++;
        continue;
      }
      if (line.startsWith('### ')) {
        result.push(
          <h3 key={i} className="text-xl font-medium mb-3 mt-6 text-foreground">
            {renderInline(line.slice(4))}
          </h3>
        );
        i++;
        continue;
      }

      // Horizontal rule
      if (line === '---') {
        result.push(<hr key={i} className="my-8 border-t-2 border-muted" />);
        i++;
        continue;
      }

      // Blockquote
      if (line.startsWith('> ')) {
        result.push(
          <blockquote key={i} className="my-4 px-4 py-3 bg-muted/50 rounded-lg border-l-4 border-primary italic">
            {renderInline(line.slice(2))}
          </blockquote>
        );
        i++;
        continue;
      }

      // Lists
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const listItems: string[] = [];
        while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
          listItems.push(lines[i].slice(2));
          i++;
        }
        result.push(
          <ul key={`list-${i}`} className="my-4 space-y-2">
            {listItems.map((item, idx) => {
              if (item.startsWith('❌')) {
                return (
                  <li key={idx} className="ml-6 flex items-start gap-2 text-red-600">
                    <span className="text-lg">❌</span>
                    <span>{renderInline(item.slice(2).trim())}</span>
                  </li>
                );
              }
              if (item.startsWith('✅')) {
                return (
                  <li key={idx} className="ml-6 flex items-start gap-2 text-green-600">
                    <span className="text-lg">✅</span>
                    <span>{renderInline(item.slice(2).trim())}</span>
                  </li>
                );
              }
              return (
                <li key={idx} className="ml-6 list-disc text-muted-foreground">
                  {renderInline(item)}
                </li>
              );
            })}
          </ul>
        );
        continue;
      }

      // Regular paragraph
      result.push(
        <p key={i} className="mb-4 leading-relaxed text-muted-foreground">
          {renderInline(line)}
        </p>
      );
      i++;
    }

    return result;
  };

  // Render table
  const renderTable = (tableLines: string[]) => {
    const headerCells = tableLines[0].split('|').filter(c => c.trim());
    const rows = tableLines.slice(1).filter(line => !line.includes('---'));

    return (
      <div className="my-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-lg overflow-hidden shadow-sm border">
          <thead className="bg-primary/10">
            <tr>
              {headerCells.map((cell, idx) => (
                <th key={idx} className="px-4 py-3 text-left font-semibold border-b">
                  {renderInline(cell.trim())}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => {
              const cells = row.split('|').filter(c => c.trim());
              return (
                <tr key={rowIdx} className="hover:bg-muted/50 transition-colors even:bg-muted/20">
                  {cells.map((cell, cellIdx) => (
                    <td key={cellIdx} className="px-4 py-3 border-b">
                      {renderInline(cell.trim())}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  // Inline formatting
  const renderInline = (text: string): React.ReactNode => {
    // Bold **text**
    const boldParts = text.split(/\*\*(.*?)\*\*/);
    if (boldParts.length > 1) {
      return boldParts.map((part, idx) =>
        idx % 2 === 1 ? <strong key={idx} className="font-semibold text-foreground">{part}</strong> : part
      );
    }
    return text;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto py-8 px-4 md:px-8 lg:px-12 max-w-3xl">
        {/* Back Button */}
        <Link href="/knowledge">
          <Button variant="ghost" size="sm" className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />
            {isZh ? '返回知识库' : 'Back to Knowledge Base'}
          </Button>
        </Link>

        {/* Article Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant="secondary">{categoryName}</Badge>
            {article.isPremium && (
              <Badge variant="default" className="gap-1">
                <Crown className="w-3 h-3" />
                Pro
              </Badge>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {isZh ? article.title : article.titleEn}
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            {isZh ? article.summary : article.summaryEn}
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="gap-1">
                <Tag className="w-3 h-3" />
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Article Content */}
        <Card className="mb-8 shadow-md">
          <CardContent className="py-8 px-6 md:px-10 lg:px-12">
            <article className="prose prose-neutral max-w-none prose-headings:scroll-mt-20">
              {renderMarkdown(isZh ? article.content : article.contentEn)}
            </article>
          </CardContent>
        </Card>

        {/* Related Exercises */}
        {article.relatedExercises.length > 0 && (
          <Card className="mb-8 bg-muted/30">
            <CardContent className="p-6">
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
            </CardContent>
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
    </div>
  );
}