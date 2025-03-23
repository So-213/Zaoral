"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      {/* ハンバーガーメニューのボタン */}
      <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>

      {/* メニュー */}
      <ul className={`menu ${isOpen ? "open" : ""}`}>
        <li>
          <Link href="/">Home</Link>
        </li>
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

      {/* スタイル調整 */}
      <style jsx>{`
        .navbar {
          border-bottom: 2px solid black;
          padding: 10px;
        }

        .hamburger {
          font-size: 24px;
          background: none;
          border: none;
          cursor: pointer;
          display: none; /* デフォルトでは非表示 */
        }

        .menu {
          list-style: none;
          padding: 0;
          display: flex;
          gap: 15px;
        }

        @media (max-width: 768px) {
          .hamburger {
            display: block;
          }

          .menu {
            display: none;
            flex-direction: column;
            position: absolute;
            top: 50px;
            left: 10px;
            background: white;
            border: 1px solid black;
            padding: 10px;
          }

          .menu.open {
            display: flex;
          }
        }
      `}</style>
    </nav>
  );
}
