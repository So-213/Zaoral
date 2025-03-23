"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // 現在のパスを取得

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); 


  if (pathname === "/" || pathname === "/login") return null;

  return (
    <nav className="navbar">
      <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>

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
        .navbar {
          border-bottom: 2px solid black;
          padding: 10px;
        }

        .hamburger {
          font-size: 24px;
          background: none;
          border: none;
          cursor: pointer;
          display: none;
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


