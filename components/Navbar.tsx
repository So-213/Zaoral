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
      {/* ハンバーガーボタン */}
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
        /* ナビバー全体 (左上に固定) */
        .navbar {
          position: fixed;
          top: 10px;
          left: 10px;
          background: #ffecec; /* 淡いピンク */
          padding: 8px 12px;
          border-radius: 8px;
          box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
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
          min-width: 160px; /* 最低幅を確保して俳句化を防ぐ */
          text-align: left; /* 左寄せ */
        }

        /* ハンバーガークリック時に表示 */
        .menu.open {
          display: flex;
        }

        /* メニューのリンク */
        .menu li {
          white-space: nowrap; /* テキストが折り返されないように */
        }

        .menu li a {
          text-decoration: none;
          color: #d64550;
          font-weight: bold;
          transition: 0.3s;
          padding: 5px 10px;
          display: block;
        }

        .menu li a:hover {
          border-bottom: 2px solid #ff5a5f;
        }
      `}</style>
    </nav>
  );
}
