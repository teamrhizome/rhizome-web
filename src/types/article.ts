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
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number;
  fy?: number;
  [key: string]: any;
}

export interface GraphLink {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface CreateArticleRequest {
  title: string;
  content: string;
  relateArticleIds: {
    articleIds: number[];
  };
}

export interface ReferenceArticleResponse {
  id: number;
  title: string;
}

export interface ArticleResponse {
  id: number;
  title: string;
  content: string;
  relateArticles: ReferenceArticleResponse[];
}

export interface AllArticleResponse {
  result: 'SUCCESS' | 'FAIL';
  data: {
    articles: ArticleResponse[];
  };
  error: null | {
    code: string;
    message: string;
    data: Record<string, unknown>;
  };
}

export interface ArticleDetailResponse {
  result: 'SUCCESS' | 'FAIL';
  data: {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    relateArticles?: ReferenceArticleResponse[];
  };
  error: null | {
    code: string;
    message: string;
    data: Record<string, unknown>;
  };
}
