import axios from 'axios';
import { CreateArticleRequest, AllArticleResponse, ArticleDetailResponse } from '@/types/article';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const articleApi = {
  createArticle: async (data: CreateArticleRequest) => {
    const response = await axios.post(`${API_BASE_URL}/articles`, data);
    return response.data;
  },

  getArticles: async () => {
    const response = await axios.get<AllArticleResponse>(`${API_BASE_URL}/articles`);
    return response.data;
  },

  getArticle: async (id: string) => {
    const response = await axios.get<ArticleDetailResponse>(`${API_BASE_URL}/articles/${id}`);
    return response.data;
  },
};
