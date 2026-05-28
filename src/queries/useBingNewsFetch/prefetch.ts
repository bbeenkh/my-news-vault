import { NEWS_MAX_PAGE, defaultNewsFilterQueries } from '@/constants';
import { queryClient } from '@/queries/queryClient';
import { TBingNewsFilterQueries } from '@/types';
import { queryOptionsFactory } from '@/utils/queryOptionsFactory';

export const prefetchBingNewsQuery = async (queries: TBingNewsFilterQueries) => {
  await queryClient.prefetchInfiniteQuery({
    ...queryOptionsFactory.news.gnews.list({
      ...defaultNewsFilterQueries,
      ...queries,
    }),
    getNextPageParam: (lastPage, pages) => {
      return pages.length === NEWS_MAX_PAGE ? undefined : pages.length + 1;
    },
    initialPageParam: 1,
  });
};
