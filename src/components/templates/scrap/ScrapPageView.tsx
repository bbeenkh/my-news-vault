import React, { Suspense } from 'react';
import ScrapGridList from '@/components/organisms/scrap/ScarpGridList';
import TotalScrapCount from '@/components/organisms/scrap/TotalScrapCount';
import ErrorBoundary from '@/components/atoms/ErrorBoundary';
import ScrapPageFallback from './ScrapPageFallback';

/**
 * 뉴스 검색 필터링+목록 페이지
 */
export default async function ScrapPageView() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-start mobile:gap-4 tablet:gap-6 desktop:gap-8 mobile:pt-4 tablet:pt-8">
      <Suspense fallback={<ScrapPageFallback />}>
        <ErrorBoundary>
          <div className="w-full mobile:px-3 tablet:px-6 desktop:px-10">
            <TotalScrapCount />
          </div>
          <ScrapGridList />
        </ErrorBoundary>
      </Suspense>
    </div>
  );
}
