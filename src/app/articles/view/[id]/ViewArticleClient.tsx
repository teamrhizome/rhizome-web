'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { articleApi } from '@/api/article';
import { ArticleDetail } from '@/types/article';

interface Props {
  id: string;
}

export default function ViewArticleClient({ id }: Props) {
  const router = useRouter();
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const article = await articleApi.getArticle(id);
        setArticle(article);
      } catch (error) {
        console.error('Failed to fetch article:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return <div className="p-4">로딩 중...</div>;
  }

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
          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/articles/edit/${id}?modal=true`)}
              className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90"
            >
              수정하기
            </button>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              돌아가기
            </button>
          </div>
        </div>
        <div className="bg-background-secondary p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">{article.title}</h2>
          <div className="text-sm text-gray-500 mb-4">
            작성일: {new Date(article.createdAt).toLocaleString()}
            {article.publishedAt !== article.createdAt && (
              <> | 발행일: {new Date(article.publishedAt).toLocaleString()}</>
            )}
          </div>
          <div className="prose prose-invert max-w-none">
            {article.content}
          </div>

          {article.relateArticles && article.relateArticles.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">관련 글</h3>
              <div className="flex flex-wrap gap-2">
                {article.relateArticles.map(relatedArticle => (
                  <button
                    key={relatedArticle.id}
                    onClick={() => router.push(`/articles/view/${relatedArticle.id}`)}
                    className="bg-background px-3 py-1 rounded-full hover:bg-background/80 transition-colors"
                  >
                    {relatedArticle.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
