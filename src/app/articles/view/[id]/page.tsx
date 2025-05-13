import { Metadata } from 'next';
import ViewArticleClient from './ViewArticleClient';

interface Props {
  params: { id: string };
}

// 기존 파라미터에 params: _params가 존재하였으나 현재 사용하지 않아
// lint를 통과하지 않는 문제를 해결하기 위해 임시로 삭제 처리합니다.
export async function generateMetadata({ params: _params }: Props): Promise<Metadata> {
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
