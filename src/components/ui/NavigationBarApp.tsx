import React from 'react';
// ★ React Router のフックをインポート
import { useLocation, useNavigate } from 'react-router-dom';

// 1. ナビゲーションに表示するページのキーを定義
// (main.tsx のパス名と一致させます)
type NavKey = '/Plan' | '/Do' | '/Setting';

// 2. ページデータを定義 (Review -> Do に変更)
interface PageDataEntry {
    buttonLabel: string;
}
const PAGE_DATA: Record<NavKey, PageDataEntry> = {
    '/Plan': { buttonLabel: 'Plan' },
    '/Do': { buttonLabel: 'Do' }, // main.tsx に合わせて Do を追加
    '/Setting': { buttonLabel: '設定' },
};

// ナビゲーションに表示するボタンの定義と順序
const navItems: NavKey[] = ['/Plan', '/Do', '/Setting'];

// 3. props を削除
const NavigationBar: React.FC = () => { 
    
    // ★ 現在地 (location) と遷移関数 (navigate) をフックで取得
    const location = useLocation();
    const navigate = useNavigate();

    // 4. 'Focus' または 'Login' ページの場合はヘッダー全体を非表示にする
    if (location.pathname === '/Focus' || location.pathname === '/Login') {
        return null;
    }

    return (
        <nav 
            id="navbar" 
            className="fixed top-0 left-0 right-0 z-50 bg-white/90 border-b border-gray-200 backdrop-blur-sm transition-all duration-300 ease-in-out"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <h1 className="text-xl font-bold text-gray-800 tracking-tight">TaskMaster</h1>
                    
                    <div className="flex space-x-3">
                        {navItems.map((key) => {
                            // 5. ★ 現在のパス (location.pathname) とボタンのキーを比較
                            const isActive = location.pathname === key;
                            const page = PAGE_DATA[key]; 
                            
                            return (
                                <button
                                    key={key}
                                    // 6. ★ navigate 関数を使って遷移
                                    onClick={() => navigate(key)}
                                    className={`
                                        nav-button px-4 py-2 rounded-lg text-sm font-medium transition duration-150 ease-in-out 
                                        ${isActive
                                            ? 'text-white bg-blue-500 shadow-lg shadow-blue-500/50 transform -translate-y-0.5'
                                            : 'text-gray-700 hover:bg-blue-100 hover:text-blue-600'
                                        }
                                    `}
                                    aria-current={isActive ? 'page' : undefined}
                                >
                                    {page.buttonLabel}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavigationBar;