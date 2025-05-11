'use client';

import { useState, useEffect } from 'react';
import { Article } from '@/types/post';

interface CreateArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateArticleModal({ isOpen, onClose }: CreateArticleModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [articleId, setArticleId] = useState('');
  const [existingArticles, setExistingArticles] = useState<Article[]>([]);
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);

  // 기존 게시글 로드
  useEffect(() => {
    const savedArticles = localStorage.getItem('articles');
    if (savedArticles) {
      try {
        const parsedArticles = JSON.parse(savedArticles);
        setExistingArticles(parsedArticles);
      } catch (error) {
        console.error('Failed to parse articles from localStorage:', error);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || !articleId.trim()) return;

    const newArticle: Article = {
      id: Date.now().toString(),
      articleId: articleId.trim(),
      title: title.trim(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      relatedArticles: selectedArticles
    };

    // localStorage에서 기존 게시글 가져오기
    const existingArticles = JSON.parse(localStorage.getItem('articles') || '[]');
    const updatedArticles = [...existingArticles, newArticle];
    localStorage.setItem('articles', JSON.stringify(updatedArticles));

    // 폼 초기화 및 모달 닫기
    setTitle('');
    setContent('');
    setArticleId('');
    setSelectedArticles([]);
    onClose();

    // storage 이벤트 발생시키기
    window.dispatchEvent(new Event('storage'));
  };

  const toggleArticleSelection = (articleId: string) => {
    setSelectedArticles(prev => 
      prev.includes(articleId)
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-background rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">새 글 작성</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="articleId" className="block text-sm font-medium mb-1">
              게시글 ID
            </label>
            <input
              type="text"
              id="articleId"
              value={articleId}
              onChange={(e) => setArticleId(e.target.value)}
              className="w-full px-3 py-2 bg-background-secondary border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="게시글 ID를 입력하세요"
            />
          </div>
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              제목
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-background-secondary border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="제목을 입력하세요"
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
              className="w-full h-48 px-3 py-2 bg-background-secondary border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              placeholder="내용을 입력하세요"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              연관 게시글
            </label>
            <div className="max-h-40 overflow-y-auto bg-background-secondary rounded-md p-2">
              {existingArticles.map(article => (
                <label key={article.id} className="flex items-center space-x-2 p-2 hover:bg-background/50 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedArticles.includes(article.articleId)}
                    onChange={() => toggleArticleSelection(article.articleId)}
                    className="rounded border-border"
                  />
                  <span>{article.title}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
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