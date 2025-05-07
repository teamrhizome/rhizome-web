'use client';

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamically import ForceGraph2D with no SSR to avoid server-side rendering issues
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
  loading: () => <div className="w-full h-[500px] flex items-center justify-center">그래프 로딩 중...</div>
});

// Define types for our graph data
type Memo = {
  id: string;
  title: string;
  content: string;
  date: string;
  backlinks: string[];
};

type GraphNode = {
  id: string;
  name: string;
  val: number; // Size of the node
  color: string;
};

type GraphLink = {
  source: string;
  target: string;
};

type GraphData = {
  nodes: GraphNode[];
  links: GraphLink[];
};

// Define type for ForceGraph instance
interface ForceGraphInstance {
  d3Force: (forceName: string) => {
    strength: (value: number) => void;
    distance: (value: number) => void;
  };
  stopSimulation: () => void;
}

export default function MemoGraph() {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [memos, setMemos] = useState<Memo[]>([]);
  const [isStabilized, setIsStabilized] = useState<boolean>(false);
  const graphRef = useRef<ForceGraphInstance>(null);

  // Use a ref to store the previous memos JSON string
  const prevMemosJsonRef = useRef<string>('');

  // Load memos from localStorage
  useEffect(() => {
    const loadMemos = () => {
      const savedMemos = localStorage.getItem('memos');
      if (savedMemos) {
        try {
          const parsedMemos = JSON.parse(savedMemos);
          // Compare with previous memos to avoid unnecessary re-renders
          const newMemosJson = JSON.stringify(parsedMemos);

          if (prevMemosJsonRef.current !== newMemosJson) {
            prevMemosJsonRef.current = newMemosJson;
            setMemos(parsedMemos);
          }
        } catch (error) {
          console.error('Failed to parse memos from localStorage:', error);
        }
      }
    };

    // Load memos once on component mount
    loadMemos();

    // Set up event listener for storage changes (for other tabs/windows)
    window.addEventListener('storage', loadMemos);

    return () => {
      window.removeEventListener('storage', loadMemos);
    };
  }, []);

  // Use a ref to store the previous graph data JSON string
  const prevGraphDataJsonRef = useRef<string>('');

  // Convert memos to graph data
  useEffect(() => {
    if (memos.length === 0) return;

    const nodes: GraphNode[] = memos.map(memo => ({
      id: memo.id,
      name: memo.title,
      val: 1 + ((memo.backlinks?.length || 0) * 0.5), // Make nodes with more backlinks slightly larger
      color: (memo.backlinks?.length || 0) > 0 ? '#4f46e5' : '#9ca3af' // Different color for nodes with backlinks
    }));

    const links: GraphLink[] = [];

    // Create links based on backlinks
    memos.forEach(memo => {
      if (memo.backlinks && memo.backlinks.length > 0) {
        memo.backlinks.forEach(targetId => {
          links.push({
            source: targetId,
            target: memo.id
          });
        });
      }
    });

    // Only update graph data if it has changed
    const newGraphData = { nodes, links };
    const newGraphDataJson = JSON.stringify(newGraphData);

    if (prevGraphDataJsonRef.current !== newGraphDataJson) {
      prevGraphDataJsonRef.current = newGraphDataJson;
      setGraphData(newGraphData);
      setIsStabilized(false); // Reset stabilization state when graph data changes
    }
  }, [memos]);

  // Stabilize the graph after it's rendered
  useEffect(() => {
    if (graphRef.current && graphData.nodes.length > 0 && !isStabilized) {
      // Allow the graph to stabilize for a short time, then stop the simulation
      const timer = setTimeout(() => {
        if (graphRef.current) {
          graphRef.current.d3Force('charge').strength(-120); // Reduce repulsion force
          graphRef.current.d3Force('link').distance(60); // Set consistent link distance
          graphRef.current.d3Force('center', null); // Remove center force

          // Stop the simulation after a delay to allow for initial positioning
          setTimeout(() => {
            if (graphRef.current) {
              graphRef.current.stopSimulation();
              setIsStabilized(true);
            }
          }, 3000); // 3 seconds should be enough for initial positioning
        }
      }, 1000); // Wait 1 second before adjusting forces

      return () => clearTimeout(timer);
    }
  }, [graphData, isStabilized]);

  // Handle node click to navigate to memo
  const handleNodeClick = (node: GraphNode) => {
    window.location.href = `/memo?id=${node.id}`;
  };

  return (
    <div className="w-full h-[500px] bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
      {graphData.nodes.length > 0 ? (
        <ForceGraph2D
          ref={graphRef}
          graphData={graphData}
          nodeLabel={(node: GraphNode) => node.name}
          nodeColor={(node: GraphNode) => node.color}
          nodeVal={(node: GraphNode) => node.val}
          linkColor={() => '#9ca3af'}
          onNodeClick={handleNodeClick}
          width={800}
          height={500}
          cooldownTicks={200}
          warmupTicks={100}
          linkDirectionalParticles={2}
          linkDirectionalParticleSpeed={0.01}
          d3VelocityDecay={0.6}
          enableNodeDrag={false} // Disable node dragging to prevent restarting simulation
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
          <p className="mb-4">메모가 없습니다.</p>
          <Link 
            href="/memo" 
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            메모 작성하기
          </Link>
        </div>
      )}
    </div>
  );
}
