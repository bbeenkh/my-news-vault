import { DehydratedState } from '@tanstack/react-query';

export type TUserInfo = {
  displayName: string;
  email: string;
  photoURL: string;
};

/**
 * 뉴스 검색 필터링 (기존 인터페이스 유지)
 */
export type TBingNewsFilterQueries = {
  keyword: string;
};

/**
 * GNews API article 원본 형식
 */
export type TGNewsArticle = {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string | null;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
};

/**
 * GNews API 응답 형식
 */
export type TGNewsAPIRes = {
  totalArticles: number;
  articles: TGNewsArticle[];
};

/**
 * 클라이언트에서 사용할 뉴스 객체 형식 (변경 없음)
 */
export type TNewsItem = {
  newsId: string;
  datePublished: string;
  description: string;
  providerIcon: string;
  providerName: string;
  thumbnail: string;
  title: string;
  isScrapped: boolean;
  url: string;
  searchQuery: string;
};

/**
 * SSR 메소드에서 넘어오는 return value
 */
export type TPageProps = {
  dehydratedState?: DehydratedState;
  userInfo: TUserInfo | null;
  query?: TBingNewsFilterQueries['keyword'];
  errCode?: string;
};
