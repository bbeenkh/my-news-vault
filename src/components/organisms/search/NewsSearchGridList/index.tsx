'use client';

import NewsGridList from '@/components/atoms/NewsGridList';
import React from 'react';
import useBingNewsFetch from '@/queries/useBingNewsFetch';
import NewsCard from '../NewsCard';
import SearchPageFallback from '@/components/templates/search/SearchPageFallback';
import SearchErrorIcon from '@/assets/search-error-icon.svg';
import SearchNoneIcon from '@/assets/search-none-icon.svg';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

export default function NewsSearchGridList() {
  const { filterQueries } = useBingNewsFetch.state();
  const { flattenData, isFetching, isError } = useBingNewsFetch.query();

  if (!filterQueries.keyword) {
    return (
      <section
        role="status"
        className="w-full h-[70dvh] flex justify-center items-center grow"
      >
        <div className="flex flex-col items-center gap-6">
          <SearchNoneIcon />
          <span>검색어를 입력해주세요</span>
        </div>
      </section>
    );
  }

  if (isFetching) return <SearchPageFallback />;

  if (isError)
    return (
      <section
        role="status"
        className="w-full h-[70dvh] flex justify-center items-center grow"
      >
        <div className="flex flex-col items-center gap-6">
          <SearchErrorIcon />
          <span>앗! 문제가 발생했어요 😢</span>
        </div>
      </section>
    );

  if (flattenData.length === 0)
    return (
      <section
        role="status"
        className="w-full h-[70dvh] flex justify-center items-center grow"
      >
        <div className="flex flex-col items-center gap-6">
          <SearchNoneIcon />
          <span>검색 결과가 없습니다. 다른 키워드를 입력해보세요</span>
        </div>
      </section>
    );

  return (
    <NewsGridList>
      <motion.div
        className="contents"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {flattenData.map((item) => (
          <motion.div key={item.newsId} variants={itemVariants}>
            <NewsCard newsItem={item} />
          </motion.div>
        ))}
      </motion.div>
    </NewsGridList>
  );
}
