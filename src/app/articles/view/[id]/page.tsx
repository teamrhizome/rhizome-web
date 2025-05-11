import { Metadata } from 'next';
import ViewArticleClient from './ViewArticleClient';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // 실제 구현에서는 데이터베이스나 API에서 게시글 정보를 가져와야 합니다
  const article = {
    title: '게시글 제목',
    content: '게시글 내용',
  };

  return {
    title: `${article.title} - Rhizome`,
    description: article.content.substring(0, 160),
    openGraph: {
      title: article.title,
      description: article.content.substring(0, 160),
    },
  };
}

export default function ViewArticlePage({ params }: Props) {
  return <ViewArticleClient id={params.id} />;
} 