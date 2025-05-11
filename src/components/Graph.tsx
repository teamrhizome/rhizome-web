'use client';

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Article, GraphData, GraphNode } from '@/types/article';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
});

interface GraphProps {
  onNodeClick: (article: Article) => void;
}

export default function Graph({ onNodeClick }: GraphProps) {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [posts, setPosts] = useState<Article[]>([]);
  const graphRef = useRef<any>(null);

  // localStorage에서 게시글 데이터 로드
  useEffect(() => {
    const loadPosts = () => {
      const savedPosts = localStorage.getItem('posts');
      if (savedPosts) {
        try {
          const parsedPosts = JSON.parse(savedPosts);
          setPosts(parsedPosts);
        } catch (error) {
          console.error('Failed to parse posts from localStorage:', error);
        }
      }
    };

    loadPosts();
    window.addEventListener('storage', loadPosts);

    return () => {
      window.removeEventListener('storage', loadPosts);
    };
  }, []);

  // 게시글 데이터를 그래프 데이터로 변환
  useEffect(() => {
    if (posts.length === 0) return;

    const nodes = posts.map(post => ({
      id: post.id,
      articleId: post.articleId,
      title: post.title,
      val: 1 + (post.relatedArticles.length * 0.5),
      color: post.relatedArticles.length > 0 ? '#4f46e5' : '#9ca3af'
    }));

    const links = posts.flatMap(post =>
      post.relatedArticles.map((targetId: string) => ({
        source: targetId,
        target: post.id
      }))
    );

    setGraphData({ nodes, links });
  }, [posts]);

  // 그래프 안정화
  useEffect(() => {
    if (graphRef.current && graphData.nodes.length > 0) {
      const timer = setTimeout(() => {
        if (graphRef.current) {
          graphRef.current.d3Force('charge').strength(-120);
          graphRef.current.d3Force('link').distance(60);
          graphRef.current.d3Force('center', null);

          setTimeout(() => {
            if (graphRef.current) {
              graphRef.current.stopSimulation();
            }
          }, 3000);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [graphData]);

  const handleNodeClick = (node: GraphNode) => {
    const post = posts.find(p => p.id === node.id);
    if (post) {
      onNodeClick(post);
    }
  };

  return (
    <div className="w-full h-full bg-background">
      {graphData.nodes.length > 0 ? (
        <ForceGraph2D
          ref={graphRef}
          graphData={graphData}
          nodeLabel={(node: any) => node.title}
          nodeColor={(node: any) => node.color}
          nodeVal={(node: any) => node.val}
          linkColor={() => '#9ca3af'}
          onNodeClick={(node: any) => handleNodeClick(node as GraphNode)}
          width={window.innerWidth}
          height={window.innerHeight - 64}
          cooldownTicks={200}
          warmupTicks={100}
          linkDirectionalParticles={2}
          linkDirectionalParticleSpeed={0.01}
          d3VelocityDecay={0.6}
          enableNodeDrag={false}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-foreground/60">
          게시글이 없습니다. 새 글을 작성해보세요!
        </div>
      )}
    </div>
  );
} 