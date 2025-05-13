'use client';

import { useEffect, useState, useRef, MutableRefObject } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ForceGraphMethods } from 'react-force-graph-2d';
import { Article } from '@/types/article';
import { articleApi } from '@/api/article';

// Dynamically import ForceGraph2D with no SSR to avoid server-side rendering issues
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
  loading: () => <div className="w-full h-[500px] flex items-center justify-center text-foreground/60">그래프 로딩 중...</div>
}) as any;

interface ArticleGraphProps {
  onNodeClick: (article: Article | null) => void;
}

import { GraphNode, GraphLink, GraphData } from '@/types/article';
export default function ArticleGraph({ onNodeClick }: ArticleGraphProps) {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [isStabilized, setIsStabilized] = useState<boolean>(false);
  const graphRef = useRef<ForceGraphMethods<{ id: string; articleId: string; title: string; val: number; color: string; x?: number; y?: number; vx?: number; vy?: number; fx?: number; fy?: number; }, GraphLink>>(null) as MutableRefObject<ForceGraphMethods<{ id: string; articleId: string; title: string; val: number; color: string; x?: number; y?: number; vx?: number; vy?: number; fx?: number; fy?: number; }, GraphLink>>;
  const prevGraphDataJsonRef = useRef<string>('');

  // Convert articles to graph data
  useEffect(() => {
    const updateGraphData = async () => {
      try {
        const response = await articleApi.getArticles();
        const articles = response.data.articles.map(article => ({
          id: article.id.toString(),
          articleId: article.id.toString(),
          title: article.title,
          content: article.content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          relatedArticles: article.relateArticles.map(ref => ref.id.toString())
        }));

        const newGraphData: GraphData = {
          nodes: articles.map(article => ({
            id: article.id,
            articleId: article.articleId,
            title: article.title,
            val: 1,
            color: '#6366f1'
          })),
          links: articles.flatMap(article =>
            article.relatedArticles.map(relatedId => ({
              source: article.id,
              target: articles.find(a => a.articleId === relatedId)?.id || ''
            }))
          ).filter(link => link.target !== '')
        };

        const newGraphDataJson = JSON.stringify(newGraphData);

        if (prevGraphDataJsonRef.current !== newGraphDataJson) {
          prevGraphDataJsonRef.current = newGraphDataJson;
          setGraphData(newGraphData);
          setIsStabilized(false);
        }
      } catch (error) {
        console.error('Failed to fetch articles:', error);
      }
    };

    updateGraphData();
  }, []);

  // Stabilize the graph after it's rendered
  useEffect(() => {
    if (graphRef.current && graphData.nodes.length > 0 && !isStabilized) {
      const timer = setTimeout(() => {
        if (graphRef.current) {
          graphRef.current.d3Force('charge')?.strength(-120);
          graphRef.current.d3Force('link')?.distance(60);
          graphRef.current.d3Force('center', null);

          setTimeout(() => {
            if (graphRef.current) {
              graphRef.current.pauseAnimation();
              setIsStabilized(true);
            }
          }, 3000);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [graphData, isStabilized]);

  const handleNodeClick = (node: any, event: MouseEvent) => {
    const article: Article = {
      id: node.id,
      articleId: node.articleId,
      title: node.title,
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      relatedArticles: []
    };
    onNodeClick(article);
  };

  return (
    <div className="w-full h-[500px] bg-background-secondary rounded-lg overflow-hidden">
      {graphData.nodes.length > 0 ? (
        <ForceGraph2D
          ref={graphRef}
          graphData={graphData}
          nodeLabel="title"
          nodeColor={() => '#6366f1'}
          nodeVal={1}
          linkColor={() => '#4f46e5'}
          onNodeClick={handleNodeClick}
          onEngineStop={() => setIsStabilized(true)}
          width={800}
          height={500}
          cooldownTicks={200}
          warmupTicks={100}
          linkDirectionalParticles={2}
          linkDirectionalParticleSpeed={0.01}
          d3VelocityDecay={0.6}
          enableNodeDrag={false}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-foreground/60">
          <p className="mb-4">게시글이 없습니다.</p>
          <Link 
            href="/articles/create" 
            className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors"
          >
            게시글 작성
          </Link>
        </div>
      )}
    </div>
  );
}
