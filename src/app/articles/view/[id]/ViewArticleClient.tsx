'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Article } from '@/types/article';

interface Props {
  id: string;
}

export default function ViewArticleClient({ id }: Props) {
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const savedArticles = localStorage.getItem('articles');
    if (savedArticles) {
      try {
        const parsedArticles = JSON.parse(savedArticles);
        setArticles(parsedArticles);
        const foundArticle = parsedArticles.find((a: Article) => a.id === id);
        setArticle(foundArticle || null);
      } catch (error) {
        console.error('Failed to parse articles from localStorage:', error);
      }
    }
  }, [id]);

  if (!article) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Rhizome</h1>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90"
            >
              돌아가기
            </button>
          </div>
          <div className="bg-background-secondary p-6 rounded-lg">
            <p>게시글을 찾을 수 없습니다.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Rhizome</h1>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90"
          >
            돌아가기
          </button>
        </div>
        <div className="bg-background-secondary p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">{article.title}</h2>
          <div className="prose prose-invert max-w-none">
            {article.content}
          </div>
          {article.relatedArticles.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">연관 게시글</h3>
              <ul className="space-y-2">
                {article.relatedArticles.map((relatedId) => {
                  const relatedArticle = articles.find(
                    (a) => a.articleId === relatedId
                  );
                  return relatedArticle ? (
                    <li key={relatedId}>
                      <button
                        onClick={() => router.push(`/articles/view/${relatedArticle.id}`)}
                        className="text-accent hover:underline"
                      >
                        {relatedArticle.title}
                      </button>
                    </li>
                  ) : null;
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 