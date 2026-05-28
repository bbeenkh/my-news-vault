import { TBingNewsFilterQueries, TGNewsAPIRes, TNewsItem, TUserInfo } from '@/types';
import { doc, getDocs, collection, deleteDoc, setDoc } from 'firebase/firestore/lite';
import { database } from '@/firebase';
import GNewsAPI from '@/api/GNewsAPI';
import APIError from '@/utils/APIError';
import ERRCODE from '@/constants/errCode';

const GNEWS_COUNT_PER_PAGE = 10;
const REVALIDATE_DURATION_SEC = 60 * 10;

/**
 * GNews API 호출
 * @param query: 검색어
 * @param pageNum: 불러올 페이지 (1-indexed)
 */
export const fetchGNews = async (
  query: TBingNewsFilterQueries['keyword'],
  pageNum: number,
) => {
  try {
    const res = await GNewsAPI.get<TGNewsAPIRes>('search', {
      params: { q: query, max: GNEWS_COUNT_PER_PAGE, page: pageNum },
      adapter: 'fetch',
      fetchOptions: {
        next: {
          tags: [query, GNEWS_COUNT_PER_PAGE, pageNum],
          revalidate: REVALIDATE_DURATION_SEC,
        },
      },
    });
    return res.data;
  } catch (e) {
    throw new APIError(ERRCODE.NEWS_FETCH_FAILED);
  }
};

/**
 * 스크랩된 데이터 호출
 */
export const fetchScrappedList = async (userId: TUserInfo['email']) => {
  try {
    const path = `scrap/${userId}/scrap`;
    const res: TNewsItem[] = [];
    const snapshot = await getDocs(collection(database, path));
    snapshot.forEach((_doc) => {
      const data = _doc.data() as TNewsItem;
      data.isScrapped = true;
      res.push(data);
    });
    return res;
  } catch (e) {
    throw new APIError(ERRCODE.SCRAP_FETCH_FAILED);
  }
};

/**
 * 스크랩
 */
export const scrapNews = async (userId: TUserInfo['email'], newsItem: TNewsItem) => {
  try {
    await setDoc(doc(database, `scrap/${userId}/scrap`, newsItem.newsId), newsItem);
  } catch (e) {
    throw new APIError(ERRCODE.SCRAP_ADD_FAILED);
  }
};

/**
 * 스크랩 해제
 */
export const unscrapNews = async (userId: TUserInfo['email'], newsId: string) => {
  try {
    const target = doc(database, `scrap/${userId}/scrap`, newsId);
    await deleteDoc(target);
  } catch (e) {
    throw new APIError(ERRCODE.SCRAP_DELETE_FAILED);
  }
};
