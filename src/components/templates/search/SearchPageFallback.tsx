'use client';

import Skeleton from '@/components/atoms/Skeleton';
import NewsGridList from '@/components/atoms/NewsGridList';
import { cn } from '@/lib/utils';
import React from 'react';
import { motion } from 'framer-motion';

const CardSkeleton = ({ idx }: { idx: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: idx * 0.03 }}
    >
      <Skeleton.Container
        className={cn(
          'p-0 relative',
          'desktop:w-[14.44rem] desktop:h-[23.38rem] tablet:w-[14.44rem] tablet:h-[23.38rem]',
          'mobile:w-full mobile:h-auto',
        )}
      >
        <Skeleton.Box className="w-full h-[13rem]" />
        <div className="p-4 flex flex-col gap-2">
          <Skeleton.Box className="w-full h-4" />
          <Skeleton.Box className="w-full h-4" />
          <Skeleton.Box className="w-full h-4" />
          <Skeleton.Box className="w-full h-4" />
        </div>
      </Skeleton.Container>
    </motion.div>
  );
};

/** skeleton ui 표시할 숫자 */
const LIST_NUM = 12;

/**
 * SearchPageView 로딩 페이지
 */
export default function SearchPageFallback() {
  return (
    <NewsGridList>
      {Array.from({ length: LIST_NUM }).map((_, idx) => (
        <CardSkeleton key={idx} idx={idx} />
      ))}
    </NewsGridList>
  );
}
