'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

export default function MemoPage() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [saved, setSaved] = useState(true);
  // Define the Memo type with backlinks
  type Memo = {
    id: string;
    title: string;
    content: string;
    date: string;
    backlinks: string[]; // IDs of memos that this memo links to
  };

  const [memos, setMemos] = useState<Memo[]>([]);
  const [selectedMemoId, setSelectedMemoId] = useState<string | null>(null);

  // Load memos from localStorage on component mount and check for URL parameters
  useEffect(() => {
    const savedMemos = localStorage.getItem('memos');
    if (savedMemos) {
      const parsedMemos = JSON.parse(savedMemos);
      setMemos(parsedMemos);

      // Check if there's an ID in the URL query parameters
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const memoId = urlParams.get('id');

        if (memoId) {
          const memo = parsedMemos.find((m: Memo) => m.id === memoId);
          if (memo) {
            setSelectedMemoId(memoId);
          }
        }
      }
    }
  }, []);

  // Save memos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('memos', JSON.stringify(memos));
  }, [memos]);

  // Load selected memo when selectedMemoId changes
  useEffect(() => {
    if (selectedMemoId) {
      const memo = memos.find(m => m.id === selectedMemoId);
      if (memo) {
        setTitle(memo.title);
        setContent(memo.content);
        setSaved(true);
      }
    }
  }, [selectedMemoId, memos]);

  // Mark as unsaved when content changes
  useEffect(() => {
    if (selectedMemoId) {
      setSaved(false);
    }
  }, [content, title]);

  const createNewMemo = () => {
    const newMemoId = Date.now().toString();
    const newMemo = {
      id: newMemoId,
      title: '새 메모',
      content: '',
      date: new Date().toISOString(),
      backlinks: []
    };
    setMemos([...memos, newMemo]);
    setSelectedMemoId(newMemoId);
    setTitle(newMemo.title);
    setContent(newMemo.content);
  };

  // Function to detect backlinks in content
  const detectBacklinks = useCallback((content: string) => {
    const backlinks: string[] = [];
    const regex = /\[\[(.*?)\]\]/g;
    let match;

    while ((match = regex.exec(content)) !== null) {
      const linkedTitle = match[1].trim();
      const linkedMemo = memos.find(m => m.title === linkedTitle);
      if (linkedMemo) {
        backlinks.push(linkedMemo.id);
      }
    }

    return backlinks;
  }, [memos]);

  const saveMemo = (saveAsNew = false) => {
    const backlinks = detectBacklinks(content);

    if (selectedMemoId && !saveAsNew) {
      // Update existing memo
      setMemos(memos.map(memo => 
        memo.id === selectedMemoId 
          ? { 
              ...memo, 
              title, 
              content, 
              date: new Date().toISOString(),
              backlinks
            } 
          : memo
      ));
      setSaved(true);
    } else if (title || content) {
      // Create new memo
      const newMemoId = Date.now().toString();
      setMemos([...memos, {
        id: newMemoId,
        title: title || '무제',
        content,
        date: new Date().toISOString(),
        backlinks
      }]);
      setSelectedMemoId(newMemoId);
      setSaved(true);
    }
  };

  const deleteMemo = (id: string) => {
    setMemos(memos.filter(memo => memo.id !== id));
    if (selectedMemoId === id) {
      setSelectedMemoId(null);
      setTitle('');
      setContent('');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            Rhizome Memo
          </Link>
          <div className="flex gap-2">
            <button
              onClick={createNewMemo}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              새 메모
            </button>
            <button
              onClick={() => saveMemo()}
              disabled={saved && selectedMemoId !== null}
              className={`px-3 py-1 rounded transition ${
                saved && selectedMemoId !== null
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {saved && selectedMemoId !== null ? '저장됨' : '저장'}
            </button>
            {selectedMemoId && (title || content) && (
              <button
                onClick={() => saveMemo(true)}
                className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
              >
                새로 저장
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-100 dark:bg-gray-800 overflow-y-auto p-4 border-r border-gray-200 dark:border-gray-700">
          <h2 className="font-bold mb-4">메모 목록</h2>
          {memos.length === 0 ? (
            <p className="text-gray-500 text-sm">메모가 없습니다. 새 메모를 작성해보세요.</p>
          ) : (
            <ul className="space-y-2">
              {memos.map(memo => (
                <li 
                  key={memo.id}
                  className={`p-2 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${
                    selectedMemoId === memo.id ? 'bg-gray-200 dark:bg-gray-700' : ''
                  }`}
                >
                  <div 
                    onClick={() => setSelectedMemoId(memo.id)}
                    className="flex flex-col"
                  >
                    <span className="font-medium truncate">{memo.title}</span>
                    <span className="text-xs text-gray-500">{formatDate(memo.date)}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteMemo(memo.id);
                    }}
                    className="text-red-500 text-xs hover:text-red-700 mt-1"
                  >
                    삭제
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        {/* Editor */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              className="w-full p-2 text-xl font-bold bg-transparent border-none outline-none"
            />
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요..."
            className="flex-1 p-4 w-full resize-none outline-none bg-white dark:bg-gray-900 font-[family-name:var(--font-geist-mono)]"
          />
        </main>
      </div>
    </div>
  );
}
