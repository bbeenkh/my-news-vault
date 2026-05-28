import { Button } from '@/components/atoms/Button';
import useAuth from '@/hooks/useAuth';
import { useScrapNews, useUnscrapNews } from '@/queries/useScrapNews';
import { TNewsItem } from '@/types';
import React, { useState } from 'react';
import NewsScrapIcon from '@/assets/news-scrap-icon.svg';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';
import { motion } from 'motion/react';
import { useAtom } from 'jotai';
import { detailNewsAtom } from '@/components/templates/search/NewsDetailTemplate';

interface IScrapButtonProps {
  isScrapped: boolean;
  newsItem: TNewsItem;
}

/** 스크랩 시 스프링 애니메이션 효과 추가 */
function SubscribeAnimation({ isScrapped, children }) {
  return (
    <motion.div
      initial={{ scale: 1 }}
      animate={{
        scale: isScrapped ? 1.3 : 1,
      }}
      exit={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 10, duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

export default function ScrapButton({ newsItem, isScrapped }: IScrapButtonProps) {
  const [{ selected: detailNews }, setDetailNews] = useAtom(detailNewsAtom);
  const { toast } = useToast();
  const { isLogined, authState } = useAuth();
  const { userInfo } = authState;
  const {
    mutateAsync: scrapNews,
    isPending: isScrappingNews,
    rollbackScrapMutation,
  } = useScrapNews();
  const {
    mutateAsync: unscrapNews,
    isPending: isUnscrappingNews,
    rollbackUnscrapMutation,
  } = useUnscrapNews();

  const title = isScrapped ? '스크랩 해제' : '스크랩 추가';

  // TODO: useCallback 추가
  const onClickScarp = async () => {
    if (!isLogined) {
      toast({
        description: '스크랩 기능은 로그인 후 이용 가능합니다',
      });
      return;
    }
    try {
      await scrapNews({
        newsItem,
        isScrapped: true,
        query: newsItem.searchQuery,
        userId: userInfo!.email,
      });
      if (detailNews) {
        setDetailNews({ selected: { ...newsItem, isScrapped: true } });
      }
      toast({
        description: '스크랩이 완료되었습니다',
      });
    } catch (e) {
      toast({
        description: '스크랩 등록 도중 문제가 발생하였습니다',
      });
      rollbackScrapMutation({
        newsItem,
        isScrapped: false,
      });
    }
  };

  // TODO: useCallback 추가
  const onClickUnscrap = async () => {
    try {
      await unscrapNews({
        newsItem,
        isScrapped: false,
        query: newsItem.searchQuery,
        userId: userInfo!.email,
      });
      if (detailNews) {
        setDetailNews({ selected: { ...newsItem, isScrapped: false } });
      }
      toast({
        description: '스크랩 삭제가 완료되었습니다',
      });
    } catch (e) {
      toast({
        description: '스크랩 삭제 도중 문제가 발생하였습니다',
      });
      rollbackUnscrapMutation({
        newsItem,
        isScrapped: true,
      });
    }
  };

  return (
    <SubscribeAnimation isScrapped={isScrapped}>
      <Button
        disabled={isScrappingNews || isUnscrappingNews}
        aria-label={title}
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          if (isScrapped) {
            onClickUnscrap();
          } else {
            onClickScarp();
          }
        }}
        className="p-2"
      >
        <NewsScrapIcon
          className={cn('!w-8 !h-8', isScrapped ? 'fill-pink-500' : 'fill-gray-400')}
        />
      </Button>
    </SubscribeAnimation>
  );
}
