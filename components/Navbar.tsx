"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // 現在のパスを取得

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // 現在のURLパスを取得

  // Home ("/") または Login ("/login") にいるときはナビバーを非表示
  if (pathname === "/" || pathname === "/login") return null;

  return (
    <nav className="navbar">
      {/* ハンバーガーメニュー (PC & スマホ両対応) */}
      <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>

      {/* ナビゲーションメニュー */}
      <ul className={`menu ${isOpen ? "open" : ""}`}>
        <li>
          <Link href="/zaoral">Zaoralとは</Link>
        </li>
        <li>
          <Link href="/howToUse">使い方</Link>
        </li>
        <li>
          <Link href="/fromAuthor">サイト制作者より</Link>
        </li>
      </ul>

      <style jsx>{`
        /* ナビバー全体 */
        .navbar {
          background: #ffecec; /* 淡いピンク */
          border-bottom: 2px solid #ff8c94; /* 濃いピンクのボーダー */
          padding: 10px 20px; /* 上下 10px、左右 20px の余白 */
          display: flex;
          justify-content: flex-start; /* 左寄せ */
          align-items: center;
        }

        /* ハンバーガーボタン (PC & スマホ共通) */
        .hamburger {
          font-size: 24px;
          background: none;
          border: none;
          cursor: pointer;
          color: #ff5a5f;
          margin-right: 20px; /* メニューとの間隔 */
        }

        /* メニュー (デフォルトは非表示) */
        .menu {
          list-style: none;
          padding: 0;
          display: none; /* クリックされるまで非表示 */
          flex-direction: column;
          position: absolute;
          top: 50px;
          left: 10px;
          background: white;
          border: 1px solid #ff8c94;
          padding: 10px;
          border-radius: 5px;
        }

        /* ハンバーガークリック時に表示 */
        .menu.open {
          display: flex;
        }

        /* PC用メニューのスタイル */
        @media (min-width: 769px) {
          .menu {
            display: flex;
            flex-direction: row;
            position: static;
            background: none;
            border: none;
            padding: 0;
            gap: 30px; /* 各要素の間隔を広げる */
          }
        }

        /* メニューのリンク */
        .menu li a {
          text-decoration: none;
          color: #d64550;
          font-weight: bold;
          transition: 0.3s;
          padding: 5px 10px;
        }

        .menu li a:hover {
          border-bottom: 2px solid #ff5a5f;
        }
      `}</style>
    </nav>
  );
}
