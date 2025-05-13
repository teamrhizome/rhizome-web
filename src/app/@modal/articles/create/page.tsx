'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { articleApi } from '@/api/article';

export default function CreateArticleModal() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedArticleIds, setSelectedArticleIds] = useState<number[]>([]);

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