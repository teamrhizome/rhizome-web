'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { articleApi } from '@/api/article';
import { ArticleDetailResponse } from '@/types/article';

interface Props {
  id: string;
}

export default function ViewArticleClient({ id }: Props) {
  const router = useRouter();
  const [article, setArticle] = useState<ArticleDetailResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await articleApi.getArticle(id);
        if (response.result === 'SUCCESS') {
          setArticle(response.data);
        }
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
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90"
          >
            돌아가기
          </button>
        </div>
        <div className="bg-background-secondary p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">{article.title}</h2>
          <div className="text-sm text-gray-500 mb-4">
            작성일: {new Date(article.createdAt).toLocaleString()}
            {article.updatedAt !== article.createdAt && (
              <> | 수정일: {new Date(article.updatedAt).toLocaleString()}</>
            )}
          </div>
          <div className="prose prose-invert max-w-none">
            {article.content}
          </div>

          {article.relateArticles && article.relateArticles.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">관련 글</h3>
              <ul className="space-y-2">
                {article.relateArticles.map((relatedArticle) => (
                  <li key={relatedArticle.id}>
                    <button
                      onClick={() => router.push(`/articles/view/${relatedArticle.id}`)}
                      className="text-accent hover:underline"
                    >
                      {relatedArticle.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
