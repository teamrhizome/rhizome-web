import { Metadata } from 'next';
import { articleApi } from '@/api/article';
import ViewArticleClient from './ViewArticleClient';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const response = await articleApi.getArticle(params.id);
    if (response.result === 'SUCCESS') {
      const article = response.data;
      return {
        title: `${article.title} - Rhizome`,
        description: article.content.substring(0, 160),
        openGraph: {
          title: article.title,
          description: article.content.substring(0, 160),
        },
      };
    }
  } catch (error) {
    console.error('Failed to fetch article metadata:', error);
  }

  return {
    title: '게시글 - Rhizome',
    description: '게시글을 찾을 수 없습니다.',
  };
}

export default function ViewArticlePage({ params }: Props) {
  return <ViewArticleClient id={params.id} />;
} 
