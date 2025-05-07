'use client';

import dynamic from 'next/dynamic';

// Dynamically import MemoGraph with no SSR
const MemoGraph = dynamic(() => import("@/components/MemoGraph"), {
  ssr: false,
  loading: () => <div className="w-full h-[500px] flex items-center justify-center">그래프 로딩 중...</div>
});

export default function ClientMemoGraph() {
  return <MemoGraph />;
}