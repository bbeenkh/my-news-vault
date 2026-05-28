'use client';

import ERRCODE from '@/constants/errCode';
import { useToast } from '@/hooks/useToast';
import APIError from '@/utils/APIError';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React from 'react';
import { ErrorBoundary as EBoundary } from 'react-error-boundary';
import { twMerge } from 'tailwind-merge';
import SearchErrorIcon from '@/assets/search-error-icon.svg';
import SearchNoneIcon from '@/assets/search-none-icon.svg';
import { Button } from '@/components/atoms/Button';

const Fallback = ({ children }) => {
  return (
    <section role="status" className="w-full h-[70dvh] flex justify-center items-center grow">
      <div className="flex flex-col items-center gap-6">{children}</div>
    </section>
  );
};

interface IProps {
  fallbackContent?: (props: { resetErrorBoundary: () => void }) => React.ReactElement;
  children: React.ReactNode;
  onError?: (error: unknown) => void;
  className?: string;
}

/**
 * react-query ErrorBoundary Wrapper 컴포넌트
 * @param {function} fallbackRender - retry 실행기능 포함된 컴포넌트 리턴 함수
 * @param {React.ReactNode} children - 에러 감쌀 컴포넌트
 * TODO: 서비스별로 UI / fallback 등 분리
 */
export default function ErrorBoundary({ onError, children, className }: IProps) {
  const { toast } = useToast();
  const [fallbackUI, setFallbackUI] = React.useState(null);

  const setFallbackIconByErrCode = (errCode: ERRCODE) => {
    switch (errCode) {
      case ERRCODE.NEWS_FETCH_FAILED:
        setFallbackUI(
          <Fallback>
            <SearchErrorIcon />
            <span>앗! 문제가 발생했어요 😢</span>
          </Fallback>,
        );
        break;
      case ERRCODE.NEWS_FETCH_NOT_FOUND:
        setFallbackUI(
          <Fallback>
            <SearchNoneIcon />
            <span>검색 결과가 없습니다. 다른 검색어를 찾아주세요</span>
          </Fallback>,
        );
        break;
      default:
        break;
    }
  };

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <EBoundary
          onReset={reset}
          fallbackRender={(props) => (
            <div className={twMerge('w-full h-full flex-center', className)}>
              <div
                role="status"
                className="w-full h-[70dvh] flex flex-col justify-center items-center grow gap-4"
              >
                {fallbackUI}
                {!fallbackUI && (
                  <>
                    <SearchErrorIcon />
                    <span>일시적인 문제가 발생했습니다</span>
                  </>
                )}
                <Button
                  variant="outline"
                  onClick={props.resetErrorBoundary}
                  className="mt-2"
                >
                  다시 시도
                </Button>
              </div>
            </div>
          )}
          onError={(e) => {
            if (e instanceof APIError) {
              setFallbackIconByErrCode(e.errCode);
              toast({
                description: e.msgFromCode,
              });
            } else {
              toast({
                description: '일시적인 문제가 발생하였습니다',
              });
            }
          }}
        >
          {children}
        </EBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
