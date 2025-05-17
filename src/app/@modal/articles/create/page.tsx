'use client';

import { useState} from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { articleApi } from '@/api/article';

export default function CreateArticleModal() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedArticleIds, setSelectedArticleIds] = useState<number[]>([]);
  const [selectedArticleId, setSelectedArticleId] = useState<number | ''>('');

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
      // Reset dropdown
      setSelectedArticleId('');
    }
  };

  // Remove article from selected list
  const removeSelectedArticle = (id: number) => {
    setSelectedArticleIds(selectedArticleIds.filter(articleId => articleId !== id));
  };

  const createArticleMutation = useMutation({
    mutationFn: articleApi.createArticle,
    onSuccess: () => {
      router.back();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createArticleMutation.mutate({
      title,
      content,
      relateArticleIds: {
        articleIds: selectedArticleIds,
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-background-secondary p-6 rounded-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">새 게시글 작성</h2>
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
              className="w-full p-2 rounded bg-background border border-border h-32"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">연결할 게시글</label>
            {articlesQuery.isError ? (
              <p className="text-red-500">게시글을 불러오는 중 오류가 발생했습니다.</p>
            ) : (
              <select
                value={selectedArticleId}
                onChange={handleArticleSelect}
                className="w-full p-2 rounded bg-background border border-border"
                disabled={articlesQuery.isLoading}
              >
                <option value="">게시글 선택</option>
                {articlesQuery.data?.data?.articles?.map((article) => (
                  <option key={article.id} value={article.id}>
                    {article.title}
                  </option>
                ))}
              </select>
            )}
            {selectedArticleIds.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium mb-1">선택된 게시글:</p>
                <ul className="space-y-1">
                  {selectedArticleIds.map((id) => {
                    const article = articlesQuery.data?.data?.articles?.find(a => a.id === id);
                    return (
                      <li key={id} className="flex items-center justify-between bg-background/50 p-2 rounded">
                        <span>{article?.title || `게시글 ${id}`}</span>
                        <button
                          type="button"
                          onClick={() => removeSelectedArticle(id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          삭제
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 bg-background text-foreground rounded hover:bg-background/80"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={createArticleMutation.isPending}
              className="px-4 py-2 bg-accent text-white rounded hover:bg-accent/90 disabled:opacity-50"
            >
              {createArticleMutation.isPending ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
