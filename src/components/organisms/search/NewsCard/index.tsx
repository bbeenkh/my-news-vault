import Card from '@/components/atoms/CardUI';
import ProfileImage from '@/components/atoms/ProfileImage';
import { cn } from '@/lib/utils';
import { TNewsItem } from '@/types';
import React, { memo } from 'react';
import NewsScrapIcon from '@/assets/news-scrap-icon.svg';
import ImageView from '@/components/atoms/ImageView';
import { useAtom } from 'jotai';
import { detailNewsAtom } from '@/components/templates/search/NewsDetailTemplate';
import styles from './NewsCard.module.css';

interface IProps {
  newsItem: TNewsItem;
}

/**
 * 뉴스 카드 컴포넌트
 */
function NewsCard({ newsItem }: IProps) {
  const [_, setDetailNews] = useAtom(detailNewsAtom);
  const { title, description, providerIcon, thumbnail, isScrapped, datePublished } = newsItem;
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
      {isScrapped && (
        <NewsScrapIcon className="absolute top-[0.6rem] right-[0.6rem] w-[2rem] h-[2rem] z-30 fill-pink-500" />
      )}
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
          <Card.Description
            className={cn('text-sm overflow-hidden max-h-[5em]', styles['card-desc-ellipsis'])}
          >
            {description}
          </Card.Description>
          {datePublished && (
            <span className="text-xs text-mnv-gray-40 mt-auto">
              {new Date(datePublished).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
      </Card.Content>
    </Card>
  );
}

export default memo(NewsCard);

// <Card.Footer className="absolute bottom-0 left-0 w-full h-auto flex justify-between p-4">
//   <span className="text-sm text-mnv-gray-40">{datePublished}</span>
//   <ScrapButton newsItem={newsItem} isScrapped={newsItem.isScrapped} />
// </Card.Footer>;
