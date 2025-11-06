import React from 'react';
// ★ Outlet をインポート
import { Outlet } from 'react-router-dom';
// ★ 修正した NavigationBar をインポート
import NavigationBar from './ui/NavigationBarApp'; // (ファイルパスは適宜調整してください)

const Layout: React.FC = () => {
  return (
    <>
      {/* 1. 全ページ共通のナビゲーションバーを配置 */}
      <NavigationBar />
      
      {/* 2. この Outlet 部分に、Plan, Do, Setting の中身が自動的に描画される */}
      {/* (pt-20 は固定ヘッダー分の高さを確保するパディング) */}
      <main className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;