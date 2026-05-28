'use client';

import useScrappedNewsList from '@/queries/useScrappedNewsList';
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * 총 스크랩 수
 */
export default function TotalScrapCount() {
  const { data } = useScrappedNewsList();
  const count = data.length;
  return (
    <div className="flex items-center gap-2">
      <span className="text-xl font-semibold text-mnv-gray">스크랩 수: 총</span>
      <AnimatePresence mode="wait">
        <motion.span
          key={count}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
          className="text-mnv-blue font-bold text-xl"
        >
          {count}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
