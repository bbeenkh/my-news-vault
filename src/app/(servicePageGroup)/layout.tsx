import React from 'react';
import Layout from '@/components/atoms/Layout';
import Header from '@/components/templates/common/Header';

/**
 * 로그인 상태에서의 layout
 */
export default function AfterLoginLayout({ children }) {
  return (
    <Layout className="w-full bg-background">
      <Layout.Header className="shadow-none fixed top-0">
        <Header />
      </Layout.Header>
      <Layout.Body>{children}</Layout.Body>
    </Layout>
  );
}
