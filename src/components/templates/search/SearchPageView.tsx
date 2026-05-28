import FilterQueriesForm from '@/components/organisms/search/FilterQueriesForm';
import NewsSearchGridList from '@/components/organisms/search/NewsSearchGridList';
import React, { cache, Suspense } from 'react';
import ErrorBoundary from '@/components/atoms/ErrorBoundary';
import SearchPageFallback from './SearchPageFallback';
import NewsDetailTemplate from './NewsDetailTemplate';
import axios from 'axios';
import { revalidateTag } from 'next/cache';

const API_REVALIDATE_SEC = 10; // 10초 후에 재검증

const fetchCacheTest = async (type: 'a' | 'b' | 'c') => {
  const res = await fetch('http://localhost:4000/api/cache-test?type=' + type, {
    next: {
      tags: [type], // 캐시 태그 설정
      revalidate: API_REVALIDATE_SEC, // 10초 후에 캐시 재검증
    },
  });
  const data = await res.json();
  console.log('fetchCacheTest res', data);
  return data;
};

/**
 * revalidate 작동 확인
 */
const fetchCacheTestAxios = async (type: 'a' | 'b' | 'c') => {
  const res = await axios.get('http://localhost:4000/api/cache-test?type=' + type, {
    adapter: 'fetch',
    fetchOptions: {
      next: {
        tags: [type], // 캐시 태그 설정
        // 10초 후에 캐시 재검증 후 최신데이터 리턴, 10초후 새로 요청시, 일단 캐시된거 리턴하고 그다음부터 최신으로 리턴
        revalidate: API_REVALIDATE_SEC,
      },
    },
  });
  console.log('fetchCacheTest res', res.data);
  return res.data;
};

// //a,b,c, 쿼리파라미터로 type 받음
// const type = searchParams.type || 'a';
// const cacheRes = await fetchCacheTest(type);
// const cacheRes2 = await fetchCacheTestAxios(type);

/**
 * 뉴스 검색 필터링+목록 페이지
 */
export default async function SearchPageView() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-start mobile:gap-4 tablet:gap-6 desktop:gap-8 bg-background">
      <NewsDetailTemplate />
      <div className="desktop:w-[42rem] tablet:w-full mobile:w-full mobile:px-3 tablet:px-4">
        <FilterQueriesForm />
      </div>
      <Suspense fallback={<SearchPageFallback />}>
        <ErrorBoundary>
          <NewsSearchGridList />
        </ErrorBoundary>
      </Suspense>
    </div>
  );
}
