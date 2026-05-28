import { defaultNewsItem } from '@/constants';
import { TBingNewsFilterQueries, TGNewsArticle, TNewsItem } from '@/types';
import { fetchGNews } from '@/api/client';
import APIError from '@/utils/APIError';
import ERRCODE from '@/constants/errCode';
// eslint-disable-next-line import/no-cycle
import { queryOptionsFactory } from '@/utils/queryOptionsFactory';
import { queryClient } from '@/queries/queryClient';
import { getSearchQueryCache } from '@/queries/useBingNewsFetch';

/**
 * YYYY-MM-DD 형식으로 날짜 변환 (변경 없음)
 */
export const parseDateToFormat = (date: string) => {
  if (!date) return '등록된 날짜 없음';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1;
  const day = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate();

  if (!year || !month || !day) return '등록된 날짜 없음';

  return `${year}-${month}-${day}`;
};

/**
 * GNews source에서 favicon URL 생성
 */
export const getProviderIcon = (source: TGNewsArticle['source']) => {
  if (!source?.url) return null;
  return `https://www.google.com/s2/favicons?domain=${source.url}&sz=64`;
};

/**
 * GNews source에서 providerName 추출
 */
export const getProviderName = (source: TGNewsArticle['source']) => {
  if (!source?.name) return null;
  return source.name;
};

/**
 * GNews article을 TNewsItem 형식으로 변환
 * newsId: url을 고유 식별자로 사용
 */
export const convertToNewsItem = (
  article: TGNewsArticle,
  searchQuery: TBingNewsFilterQueries['keyword'],
  isScrapped: boolean,
): TNewsItem => {
  return {
    newsId: article?.url || defaultNewsItem.newsId,
    datePublished: parseDateToFormat(article?.publishedAt) || defaultNewsItem.datePublished,
    description: article?.description || defaultNewsItem.description,
    providerIcon: getProviderIcon(article?.source) || defaultNewsItem.providerIcon,
    providerName: getProviderName(article?.source) || defaultNewsItem.providerName,
    thumbnail: article?.image || defaultNewsItem.thumbnail,
    title: article?.title || defaultNewsItem.title,
    isScrapped,
    searchQuery,
    url: article?.url || defaultNewsItem.url,
  };
};

/**
 * 스크랩 여부 플래그 획득 (변경 없음)
 */
export const setIsScrapped = (
  targetNewsId: TNewsItem['newsId'],
  scrappedNewsList: TNewsItem[],
) => {
  if (!scrappedNewsList) return false;
  const hasSame = scrappedNewsList.find((item) => item.newsId === targetNewsId);
  return Boolean(hasSame);
};

/**
 * 중복된 기사인지 판별 (변경 없음)
 */
export const isDuplicatedNews = (
  targetNewsId: TNewsItem['newsId'],
  curNewsItems: TNewsItem[],
) => {
  if (!curNewsItems) return false;
  const isDuplicated = curNewsItems.find((item) => item.newsId === targetNewsId);
  return isDuplicated !== undefined;
};

/**
 * 특수문자 포함되었는지 확인 (변경 없음)
 */
export const hasSpecialCharacters = (str: string) => {
  const regExp = /[~!@#$%^&*()_+|<>?:{}]/;
  return !regExp.test(str);
};

/**
 * 검색 쿼리 문자열 생성 (변경 없음)
 */
export const createSearchUrlWithQueries = (filterQueries: Record<string, string | number>) => {
  const url = new URLSearchParams();
  const keys = Object.keys(filterQueries);
  keys.forEach((key) => {
    if (filterQueries[key] !== null && filterQueries[key] !== undefined && filterQueries[key] !== '') {
      url.append(key, filterQueries[key].toString());
    }
  });
  return `?${url.toString()}`;
};

/**
 * GNews API에서 가져온 데이터를 TNewsItem 형식으로 변환
 * - 중복 뉴스 제거
 * - 스크랩 데이터 사용하여 isScrapped 초기화
 */
export async function fetchNewsListAndConvert(
  filterQueries: TBingNewsFilterQueries,
  pageParam: number,
) {
  const { keyword } = filterQueries;
  const fetchResult = await fetchGNews(keyword, pageParam);

  if (fetchResult.articles.length === 0) {
    throw new APIError(ERRCODE.NEWS_FETCH_NOT_FOUND);
  }

  const scrappedNewsList = queryClient.getQueryData<TNewsItem[]>(
    queryOptionsFactory.scrap.list('dd').queryKey,
  );
  const curNewsItems = getSearchQueryCache(filterQueries);

  const convertedNewsList = fetchResult.articles
    .map((article) => {
      const isScrapped = setIsScrapped(article.url, scrappedNewsList ?? []);
      const isDuplicated = isDuplicatedNews(article.url, curNewsItems);
      if (!isDuplicated) {
        return convertToNewsItem(article, keyword, isScrapped);
      } else {
        return undefined;
      }
    })
    .filter(Boolean);

  return convertedNewsList;
}
