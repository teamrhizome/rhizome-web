import { Metadata } from 'next';
import { articleApi } from '@/api/article';
import ViewArticleClient from './ViewArticleClient';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const article = await articleApi.getArticle(resolvedParams.id);
    const description = article.content ? article.content.substring(0, 160) : '';
    return {
      title: `${article.title} - Rhizome`,
      description,
      openGraph: {
        title: article.title,
        description,
      },
    };
  } catch (error) {
    console.error('Failed to fetch article metadata:', error);
  }

  return {
    title: '게시글 - Rhizome',
    description: '게시글을 찾을 수 없습니다.',
  };
}

export default async function ViewArticlePage({ params }: Props) {
  const resolvedParams = await params;
  return <ViewArticleClient id={resolvedParams.id} />;
}
