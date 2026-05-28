'use client';

import { Dialog, DialogContent } from '@/components/atoms/Dialog'; // Dialog 경로에 맞게 변경
import { TNewsItem } from '@/types';
import { atom, useAtom } from 'jotai';
import ScrapButton from '@/components/organisms/search/ScrapButton';
import { cn } from '@/lib/utils';
import ProfileImage from '@/components/atoms/ProfileImage';
import ImageView from '@/components/atoms/ImageView';
import styles from '@/components/organisms/search/NewsCard/NewsCard.module.css';
import Card from '@/components/atoms/CardUI';

export const detailNewsAtom = atom<{
  selected: TNewsItem | null;
}>({
  selected: null,
});

/**
 * 뉴스 상세정보 모달 템플릿
 * - 뉴스 제목
 * - 뉴스 상세정보
 * - 뉴스 이미지
 * - 뉴스 작성일
 * - 뉴스 스크랩 버튼
 */
export default function NewsDetailTemplate() {
  const [{ selected: detailNews }, setDetailNews] = useAtom(detailNewsAtom);
  if (!detailNews) return null;
  return (
    <Dialog
      open={!!detailNews}
      onOpenChange={(isOpen) =>
        !isOpen &&
        setDetailNews({
          selected: null,
        })
      }
    >
      <DialogContent className="!bg-card">
        <ProfileImage
          src={detailNews.providerIcon}
          alt={detailNews.title}
          className={cn('absolute top-[0.6rem] left-[0.6rem] w-[2rem] h-[2rem] z-30')}
        />
        <Card className={cn('p-0 relative border-none shadow-none')}>
          {/* thumbnail */}
          {/* FIXME: ImageView 적용, 현재 next/image가 외부이미지를 못읽어 문제발생 */}
          <div className="overflow-hidden rounded-t-lg">
            <ImageView
              src={detailNews.thumbnail}
              alt={detailNews.title}
              className={cn('w-full aspect-[4/3.8]')}
            />
          </div>
          <Card.Content className="h-auto">
            <div className="flex flex-col gap-2 mb-6">
              <Card.Title className={cn('text-md')}>{detailNews.title}</Card.Title>
              <Card.Description className={cn('text-sm overflow-hidden')}>
                {detailNews.description}
              </Card.Description>
            </div>
            <div className="w-full flex justify-between items-center border-t border-mnv-gray-10 pt-3 mt-3">
              <span className="text-sm text-mnv-gray-40">
                {(() => {
                  try {
                    const d = new Date(detailNews.datePublished);
                    if (isNaN(d.getTime())) return detailNews.datePublished;
                    return d.toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    });
                  } catch {
                    return detailNews.datePublished;
                  }
                })()}
              </span>
              <ScrapButton newsItem={detailNews} isScrapped={detailNews.isScrapped} />
            </div>
          </Card.Content>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
