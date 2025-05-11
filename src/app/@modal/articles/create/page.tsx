'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Article } from '@/types/article';

export default function CreateArticleModal() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [relatedArticles, setRelatedArticles] = useState<string[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const savedArticles = localStorage.getItem('articles');
    if (savedArticles) {
      try {
        const parsedArticles = JSON.parse(savedArticles);
        setArticles(parsedArticles);
      } catch (error) {
        console.error('Failed to parse articles from localStorage:', error);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newArticle: Article = {
      id: Date.now().toString(),
      articleId: Date.now().toString(), // 임시 ID, 백엔드 연동 시 변경
      title,
      content,
      relatedArticles,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedArticles = [...articles, newArticle];
    localStorage.setItem('articles', JSON.stringify(updatedArticles));
    
    // 모달 닫기
    router.back();
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background-secondary p-6 rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">게시글 작성</h2>
          <button
            onClick={handleClose}
            className="text-foreground/60 hover:text-foreground"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              제목
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-md"
              required
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-1">
              내용
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-md h-32"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              연관 게시글
            </label>
            <select
              multiple
              value={relatedArticles}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, option => option.value);
                setRelatedArticles(selected);
              }}
              className="w-full px-3 py-2 bg-background border border-border rounded-md"
            >
              {articles.map((article) => (
                <option key={article.id} value={article.articleId}>
                  {article.title}
                </option>
              ))}
            </select>
            <p className="text-sm text-foreground/60 mt-1">
              Ctrl(Windows) 또는 Command(Mac)를 누른 상태에서 여러 게시글을 선택할 수 있습니다.
            </p>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-foreground/60 hover:text-foreground"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90"
            >
              작성
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 