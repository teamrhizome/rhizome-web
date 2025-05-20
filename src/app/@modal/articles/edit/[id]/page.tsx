'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { articleApi } from '@/api/article';
import { ArticleDetail } from '@/types/article';

interface Props {
  params: { id: string };
}

export default function EditArticleModal({ params }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedArticleIds, setSelectedArticleIds] = useState<number[]>([]);
  const [selectedArticleId, setSelectedArticleId] = useState<number | ''>('');

  // Fetch article data
  const articleQuery = useQuery({
    queryKey: ['article', params.id],
    queryFn: () => articleApi.getArticle(params.id),
  });

  // Update form data when article is loaded
  if (articleQuery.data && title === '') {
    const article = articleQuery.data;
    setTitle(article.title);
    setContent(article.content);
    setSelectedArticleIds(article.relateArticles.map(article => article.id));
  }

  // Fetch all articles for the dropdown
  const articlesQuery = useQuery({
    queryKey: ['articles'],
    queryFn: articleApi.getArticles,
  });

  // Handle article selection from dropdown
  const handleArticleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) {
      const articleId = parseInt(value, 10);
      // Only add if not already selected
      if (!selectedArticleIds.includes(articleId)) {
        setSelectedArticleIds([...selectedArticleIds, articleId]);
      }
      setSelectedArticleId('');
    }
  };

  // Remove article from selected list
  const removeSelectedArticle = (id: number) => {
    setSelectedArticleIds(selectedArticleIds.filter(articleId => articleId !== id));
  };

  const updateArticleMutation = useMutation({
    mutationFn: (data: { title: string; content: string; relateArticleIds: { articleIds: number[] } }) =>
      articleApi.updateArticle(parseInt(params.id, 10), data),
    onSuccess: () => {
      router.back();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateArticleMutation.mutate({
      title,
      content,
      relateArticleIds: {
        articleIds: selectedArticleIds,
      },
    });
  };

  if (articleQuery.isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div className="bg-background-secondary p-6 rounded-lg w-full max-w-2xl">
          <p>로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-background-secondary p-6 rounded-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">게시글 수정</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 rounded bg-background border border-border"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 rounded bg-background border border-border h-40"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">관련 글</label>
            <div className="flex gap-2 mb-2">
              <select
                value={selectedArticleId}
                onChange={handleArticleSelect}
                className="flex-1 p-2 rounded bg-background border border-border"
              >
                <option value="">관련 글 선택</option>
                {articlesQuery.data?.data.articles
                  .filter(article => article.id.toString() !== params.id)
                  .map(article => (
                    <option key={article.id} value={article.id}>
                      {article.title}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedArticleIds.map(id => {
                const article = articlesQuery.data?.data.articles.find(a => a.id === id);
                return (
                  <div
                    key={id}
                    className="bg-background px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    <span>{article?.title}</span>
                    <button
                      type="button"
                      onClick={() => removeSelectedArticle(id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90"
              disabled={updateArticleMutation.isPending}
            >
              {updateArticleMutation.isPending ? '수정 중...' : '수정하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
