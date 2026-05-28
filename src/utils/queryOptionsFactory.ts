import { fetchScrappedList } from '@/api/client';
import { TBingNewsFilterQueries, TUserInfo } from '@/types';
// eslint-disable-next-line import/no-cycle
import { fetchNewsListAndConvert } from '@/utils/newsItem';

export const QK_PRIVATE = 'PRIVATE';
export const QK_PUBLIC = 'PUBLIC';
export const QK_NEWS = 'NEWS';
export const QK_GNEWS = 'GNEWS';
export const QK_SCRAP = 'SCRAP';

export const queryOptionsFactory = {
  news: {
    gnews: {
      list: (filterQueries: TBingNewsFilterQueries) => ({
        queryKey: [QK_PUBLIC, QK_NEWS, QK_GNEWS, 'LIST', { ...filterQueries }],
        queryFn: ({ pageParam = 1 }) => fetchNewsListAndConvert(filterQueries, pageParam),
      }),
    },
  },
  scrap: {
    list: (userId: TUserInfo['email']) => ({
      queryKey: [QK_PRIVATE, QK_SCRAP, 'LIST', userId],
      queryFn: () => fetchScrappedList(userId),
    }),
  },
};
