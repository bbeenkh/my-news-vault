'use client';
import AppLogo from '@/components/atoms/AppLogo';
import ProfileImage from '@/components/atoms/ProfileImage';
import LogoutButton from '@/components/molecules/LogoutButton';
import ToScrapPageButton from '@/components/organisms/scrap/ToScrapPageButton';
import useAuth from '@/hooks/useAuth';
import { usePathname } from 'next/navigation';
import React from 'react';
import LoginDialogTemplate from '../../search/LoginDialogTemplate';

const Header = () => {
  const { isLogined, authState } = useAuth();
  const pathname = usePathname();
  const isScrapActive = pathname === '/scrap';
  const user = authState.userInfo;

  return (
    <div className="w-full h-full mx-auto flex justify-between items-center bg-background border-b border-mnv-gray-10">
      <div className="flex items-center justify-center hover:opacity-80 transition-opacity duration-200 cursor-pointer">
        <AppLogo />
      </div>
      <div className="flex justify-end items-center">
        {isLogined && (
          <div
            className={`scrap-link flex justify-end items-center ${
              isScrapActive
                ? 'border-b-2 border-mnv-blue pb-0.5'
                : 'hover:text-mnv-blue transition-colors duration-200'
            }`}
          >
            <ToScrapPageButton />
          </div>
        )}
        <div className="login-logout mobile:ml-2 tablet:ml-5 desktop:ml-10 flex items-center">
          {isLogined && user?.photoURL && (
            <ProfileImage
              src={user.photoURL}
              alt={user.displayName ?? 'profile'}
              width={32}
              height={32}
              className="w-8 h-8 mr-2"
            />
          )}
          {isLogined ? <LogoutButton /> : <LoginDialogTemplate.OpenButton />}
        </div>
      </div>
    </div>
  );
};

export default Header;
