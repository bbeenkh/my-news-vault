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

const KOREAN_REGEX = /[ㄱ-ㅎㅏ-ㅣ가-힣]/;

/**
 * 검색 입력 컴포넌트 (Input + Button)
 * GNews는 영문 검색만 지원하므로 한글 입력 차단
 */
export default function FilterQueriesForm() {
  const router = useRouter();
  const { filterQueries: initializedFilterQueries } = useBingNewsFetch.state();
  const [filterQueries, setFilterQueries] = useState<TBingNewsFilterQueries>({
    ...initializedFilterQueries,
  });
  const [showKoreanError, setShowKoreanError] = useState(false);

  useEffect(() => {
    setFilterQueries({ ...initializedFilterQueries });
  }, [initializedFilterQueries]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const hasKorean = KOREAN_REGEX.test(value);
    setShowKoreanError(hasKorean);
    setFilterQueries({ ...filterQueries, keyword: value.replace(KOREAN_REGEX, '') });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const url = createSearchUrlWithQueries(filterQueries);
      router.push(url);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form className="w-full flex flex-col gap-1" onSubmit={handleSubmit}>
      <div className="flex gap-2">
        <Input
          className={`border-mnv-gray-10 focus:ring-2 focus:border-mnv-blue transition-all duration-200 ${
            showKoreanError
              ? 'border-red-400 focus:ring-red-300 focus:border-red-400'
              : 'focus:ring-mnv-blue/40'
          }`}
          onChange={handleChange}
          value={filterQueries.keyword}
          placeholder="Search news in English"
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
      </div>
      {showKoreanError && (
        <p className="text-xs text-red-500 pl-1">영문으로만 검색할 수 있습니다 (한국어 추가 지원 예정)</p>
      )}
    </form>
  );
}
