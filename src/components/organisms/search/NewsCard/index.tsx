import Card from '@/components/atoms/CardUI';
import ProfileImage from '@/components/atoms/ProfileImage';
import { cn } from '@/lib/utils';
import { TNewsItem } from '@/types';
import React, { memo } from 'react';
import ImageView from '@/components/atoms/ImageView';
import { useAtom } from 'jotai';
import { detailNewsAtom } from '@/components/templates/search/NewsDetailTemplate';
import styles from './NewsCard.module.css';
import ScrapButton from '@/components/organisms/search/ScrapButton';

interface IProps {
  newsItem: TNewsItem;
}

/**
 * 뉴스 카드 컴포넌트
 */
function NewsCard({ newsItem }: IProps) {
  const [_, setDetailNews] = useAtom(detailNewsAtom);
  const { title, providerIcon, thumbnail, datePublished } = newsItem;
  return (
    <Card
      className={cn(
        'p-0 relative group cursor-pointer',
        'desktop:w-[14.44rem] desktop:h-[23.38rem]',
        'tablet:w-[14.44rem] tablet:h-[23.38rem]',
        'mobile:w-full mobile:h-auto',
        'hover:-translate-y-1 hover:shadow-xl hover:border-mnv-blue/30 transition-all duration-200 ease-out',
      )}
      onClick={() => {
        setDetailNews({
          selected: newsItem,
        });
      }}
    >
      <ProfileImage
        src={providerIcon}
        alt={title}
        className={cn('absolute top-[0.6rem] left-[0.6rem] w-[2rem] h-[2rem] z-30')}
      />
      {/* thumbnail */}
      {/* FIXME: ImageView 적용, 현재 next/image가 외부이미지를 못읽어 문제발생 */}
      <div className="overflow-hidden rounded-t-lg">
        <ImageView src={thumbnail} alt={title} className={cn('w-full aspect-[4/3.8] transition-transform duration-300 group-hover:scale-105')} />
      </div>
      <Card.Content className="p-4 !text-card-foreground">
        <div className="flex flex-col gap-2 mb-6">
          <Card.Title className={cn('text-md', styles['card-title-ellipsis'])}>
            {title}
          </Card.Title>
        </div>
      </Card.Content>
      <Card.Footer
        className="absolute bottom-0 left-0 w-full h-auto flex justify-between p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-sm text-mnv-gray-40">{datePublished}</span>
        <ScrapButton newsItem={newsItem} isScrapped={newsItem.isScrapped} />
      </Card.Footer>
    </Card>
  );
}

export default memo(NewsCard);
