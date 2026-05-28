'use client';

import { Button } from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import useBingNewsFetch from '@/queries/useBingNewsFetch';
import { TBingNewsFilterQueries } from '@/types';
import { createSearchUrlWithQueries } from '@/utils/newsItem';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import SearchIcon from '@/assets/search-ui.svg';
import { motion } from 'framer-motion';

/**
 * 검색 입력 컴포넌트 (Input + Button)
 */
export default function FilterQueriesForm() {
  const router = useRouter();
  const { filterQueries: initializedFilterQueries } = useBingNewsFetch.state();
  const [filterQueries, setFilterQueries] = useState<TBingNewsFilterQueries>({
    ...initializedFilterQueries,
  });

  useEffect(() => {
    setFilterQueries({ ...initializedFilterQueries });
  }, [initializedFilterQueries]);

  /**
   * query onChange
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterQueries({ ...filterQueries, keyword: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      // make query into query string
      const url = createSearchUrlWithQueries(filterQueries);
      router.push(url);
    } catch (err) {
      // TODO: 에러 처리
      console.error(err);
    }
  };

  return (
    <form className="w-full flex gap-2" onSubmit={handleSubmit}>
      <Input
        className="border-mnv-gray-10 focus:ring-2 focus:ring-mnv-blue/40 focus:border-mnv-blue transition-all duration-200"
        onChange={handleChange}
        value={filterQueries.keyword}
        placeholder="뉴스 키워드를 입력하세요"
      />
      <motion.button
        className="border border-mnv-gray-10 rounded-md px-3 py-2 flex items-center justify-center"
        type="submit"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        <SearchIcon />
      </motion.button>
    </form>
  );
}
