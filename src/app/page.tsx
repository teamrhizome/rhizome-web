'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Article } from '@/types/article';
import ArticleGraph from '@/components/graph/ArticleGraph';
import { articleApi } from '@/api/article';

export default function Home() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const response = await articleApi.getArticles();
        const mappedArticles = response.data.articles.map(article => ({
          id: article.id.toString(),
          articleId: article.id.toString(),
          title: article.title,
          content: article.content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          relatedArticles: article.relateArticles.map(ref => ref.id.toString())
        }));
        setArticles(mappedArticles);
      } catch (error) {
        console.error('Failed to fetch articles:', error);
      }
    };

    loadArticles();
  }, []);

  const handleNodeClick = (article: Article | null) => {
    if (article) {
      router.push(`/articles/view/${article.id}`);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Rhizome</h1>
          <button
            onClick={() => router.push('/articles/create?modal=true')}
            className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90"
          >
            게시글 작성
          </button>
        </div>
        <ArticleGraph onNodeClick={handleNodeClick} />
      </div>
    </main>
  );
}
