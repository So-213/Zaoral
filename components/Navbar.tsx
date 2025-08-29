// ./components/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; 
import { useSession } from "next-auth/react"; //クライアントサイドコンポート



export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname(); // 現在のURLパスを取得
  const router = useRouter();
  const { data: session, status } = useSession();  // 完全クライアント側で状態管理するわけではなくてリロードするたびにサーバ側と同期される
 
  // ページ遷移の検知
  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    // カスタムイベントリスナーを追加
    window.addEventListener('beforeunload', handleStart);
    window.addEventListener('load', handleComplete);

    return () => {
      window.removeEventListener('beforeunload', handleStart);
      window.removeEventListener('load', handleComplete);
    };
  }, []);

  // パスが変更された時にローディングを停止
  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  // ローディング状態が開始されたら一定時間後に自動停止
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 3000); // 3秒後に自動停止

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (pathname === "/login") return null;

  // メニューを閉じる関数
  const closeMenu = () => {
    setIsOpen(false);
  };

  // メニュー内のリンククリック時にメニューを閉じる
  const handleLinkClick = (href: string) => {
    closeMenu();
    
    // 同じページに飛ぶ場合はリロード
    if (pathname === href) {
      window.location.reload();
      return;
    }
    
    setIsLoading(true);
  };

  return (
    <>
      {/* ローディングオーバーレイ */}
      {isLoading && (
        <div 
          className="loading-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            pointerEvents: 'none'
          }}
        >
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p style={{ marginTop: '10px', color: '#ff5a5f', fontWeight: 'bold' }}>読み込み中...</p>
          </div>
        </div>
      )}

      {/* オーバーレイ - メニューが開いている時のみ表示 */}
      {isOpen && (
        <div 
          className="overlay" 
          onClick={closeMenu}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 999,
            cursor: 'pointer'
          }}
        />
      )}
      
      <nav className="navbar">
        {/* ハンバーガーボタン */}
        <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>

        {/* ナビゲーションメニュー */}
        <ul className={`menu ${isOpen ? "open" : ""}`}>
          <li>
            <Link href="/" onClick={() => handleLinkClick("/")}>Home</Link>
          </li>
          <li>
            <Link href="/zaoral" onClick={() => handleLinkClick("/zaoral")}>Zaoralとは</Link>
          </li>
          <li>
            <Link href="/howToUse" onClick={() => handleLinkClick("/howToUse")}>使い方</Link>
          </li>
          {/* <li>
            <Link href="/fromAuthor" onClick={() => handleLinkClick("/fromAuthor")}>サイト制作者より</Link>
          </li>   */}
          {status === "authenticated" && session?.user && (
            <li>
              <Link href="/account" onClick={() => handleLinkClick("/account")}>アカウント情報</Link>
            </li>

          )}
          {status === "authenticated" && session?.user && (
            <li>
              <Link href="/dashboard" onClick={() => handleLinkClick("/dashboard")}>ダッシュボード</Link>
            </li>

          )}
        </ul>


        <style jsx>{`
          .navbar {
            position: fixed;
            top: 10px;
            left: 10px;
            background:rgb(246, 210, 239); /* 淡いピンク */
            padding: 8px 12px;
            border-radius: 8px;
            box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
            z-index: 1000; /* オーバーレイより上に表示 */
          }

          /* ハンバーガーボタン */
          .hamburger {
            font-size: 24px;
            background: none;
            border: none;
            cursor: pointer;
            color: #ff5a5f;
          }

          /* メニュー (デフォルトは非表示) */
          .menu {
            list-style: none;
            padding: 0;
            display: none; /* クリックされるまで非表示 */
            flex-direction: column;
            position: absolute;
            top: 40px; /* ハンバーガーのすぐ下 */
            left: 0;
            background: white;
            border: 1px solid #ff8c94;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
            min-width: 180px; /* 幅を統一 */
            text-align: left;
            z-index: 1001; /* オーバーレイより上に表示 */
          }

          /* ハンバーガークリック時に表示 */
          .menu.open {
            display: flex;
          }

          /* ボタン風リンク */
          .menu li {
            margin-bottom: 8px; /* ボタン間の余白 */
          }

          .menu li a {
            display: block !important; /* 確実に適用 */
            width: 100%; /* ボタン幅を固定 */
            padding: 12px 15px;
            background: #ffecec; /* 淡いピンク */
            border-radius: 6px;
            text-decoration: none;
            color: #d64550;
            font-weight: bold;
            text-align: center;
            border: 1px solid #ff8c94;
            transition: background 0.3s, transform 0.1s;
          }

          /* ホバー時 */
          .menu li a:hover {
            background: #ffccd5; /* ちょっと濃いピンク */
          }

          /* クリック時のエフェクト */
          .menu li a:active {
            transform: scale(0.96); /* クリック時に少し縮む */
          }

          /* ローディングスピナー */
          .loading-spinner {
            text-align: center;
          }

          .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #ff5a5f;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </nav>
    </>
  );
}
