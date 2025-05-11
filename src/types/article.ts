export interface Article {
  id: string;
  articleId: string; // 백엔드 연동용 ID
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  relatedArticles: string[]; // 연관된 게시글의 articleId 배열
}

export interface GraphNode {
  id: string;
  articleId: string;
  title: string;
  val: number;
  color: string;
}

export interface GraphLink {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
} 