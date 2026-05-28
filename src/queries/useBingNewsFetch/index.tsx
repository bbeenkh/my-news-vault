'use client';

import { NEWS_MAX_PAGE, defaultNewsFilterQueries } from '@/constants';
import { queryClient } from '@/queries/queryClient';
import { TBingNewsFilterQueries, TNewsItem } from '@/types';
import {
  InfiniteData,
  useInfiniteQuery,
  useSuspenseInfiniteQuery,
} from '@tanstack/react-query';
import { atom, useAtom, useAtomValue } from 'jotai';
import { flatMap } from 'lodash-es';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { queryOptionsFactory } from '@/utils/queryOptionsFactory';

/**
 * 뉴스 검색 쿼리 캐시 데이터 조회
 * @param searchQuery: 뉴스 검색 쿼리 (queryKey)
 * @returns 캐시 데이터
 */
export const getSearchQueryCache = (filterQueries: TBingNewsFilterQueries) => {
  const res = queryClient.getQueryData<InfiniteData<TNewsItem[]>>(
    queryOptionsFactory.news.gnews.list(filterQueries).queryKey,
  );

  return flatMap(res?.pages, (item) => {
    return item;
  });
};

/** 검색어 query atom */
export const queryAtom = atom<TBingNewsFilterQueries>({
  ...defaultNewsFilterQueries,
});

/**
 * bing news fetch api hook
 */
function useBingNewsFetchQuery() {
  const filterQueries = useAtomValue(queryAtom);

  const queryStates = useInfiniteQuery({
    ...queryOptionsFactory.news.gnews.list(filterQueries),
    getNextPageParam: (lastPage, pages) => {
      return pages.length === NEWS_MAX_PAGE ? undefined : pages.length + 1;
    },
    initialPageParam: 1,
    enabled: !!filterQueries.keyword,
    placeholderData: {
      pages: [],
      pageParams: [1],
    },
  });

  // 이중배열 구조 평탄화
  const flattenData = useMemo(() => {
    return flatMap(queryStates.data?.pages, (item) => {
      return item;
    });
  }, [queryStates.data?.pages]);

  return {
    ...queryStates,
    flattenData,
  };
}

/**
 * 뉴스 검색 상태 hook
 * @return
    - filterQueries: 검색어 상태,
    - setFilterQueries: 검색어 상태 변경 함수
 * @example
 * ```
 * const { filterQueries, setFilterQueries } = useBingNewsFetchState();
 * ```
 */
function useBingNewsFetchState() {
  const searchParams = useSearchParams();

  const [filterQueries, _setFilterQueries] = useAtom(queryAtom);
  const setFilterQueries = (newFilterQueries: Partial<TBingNewsFilterQueries>) => {
    _setFilterQueries({
      ...filterQueries,
      ...newFilterQueries,
    });
  };

  /**
   * 쿼리 파라미터 변경에 따라 form 상태 초기화
   * TODO: jotai 사용하여초기화하는게 맞는지 확인: 검색 상태는 searchParams에 의해 결정되는 중...
   * */
  useEffect(() => {
    const keyword = searchParams.get('keyword') || '';
    setFilterQueries({ ...filterQueries, keyword });
  }, [searchParams]);

  return {
    filterQueries,
    setFilterQueries,
  };
}

/**
 * 스크랩/언스크랩 시, 뉴스 캐시 데이터 업데이트 수행
 * @param targetNewsId: 스크랩시추가/삭제 대상 뉴스 아이디
 * @param isScrapped: true: 추가, false: 삭제
 * @param query: queryKey = 검색어
 */
export function updateNewsSearchQuery(
  targetNewsId: TNewsItem['newsId'],
  isScrapped: TNewsItem['isScrapped'],
  filterQueries: TBingNewsFilterQueries,
) {
  queryClient.setQueryData<InfiniteData<TNewsItem[]>>(
    queryOptionsFactory.news.gnews.list(filterQueries).queryKey,
    (oldPagesArray) => {
      if (oldPagesArray) {
        // 캐시 데이터 존재하는 경우: 캐시 업데이트
        const newPageArray = oldPagesArray.pages.map((page) => {
          return page.map((item) => {
            if (item.newsId === targetNewsId) {
              return {
                ...item,
                isScrapped,
              };
            }
            return item;
          });
        });

        return {
          pages: newPageArray,
          pageParams: oldPagesArray.pageParams,
        };
      }
    },
  );
}


const useBingNewsFetch = {
  query: useBingNewsFetchQuery,
  state: useBingNewsFetchState,
};

export default useBingNewsFetch;
