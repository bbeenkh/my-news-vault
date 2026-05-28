import React from 'react';

interface IProps {
  children: React.ReactNode;
}

/**
 * 뉴스 리스트 4XN으로 gird 형식으로 렌더링
 * desktop: 4열, tablet: 3열, mobile: 1열
 * @returns
 */
export default function NewsGridLayout({ children }: IProps) {
  return (
    <div className="flex flex-col items-center w-full min-h-screen desktop:w-[64rem] tablet:w-[48rem]">
      <div className="grid grid-cols-1 mobile:gap-3 tablet:gap-5 desktop:gap-5 w-full max-w-5xl mobile:px-3 tablet:px-5 mobile:mb-4 tablet:mb-7 tablet:grid-cols-3 desktop:grid-cols-4 mobile:grid-cols-1">
        {children}
      </div>
    </div>
  );
}
