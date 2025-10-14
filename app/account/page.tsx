"use client";

import { signOut, useSession } from "next-auth/react"; // NextAuth.js のクライアント側フック 



export default function AccountPage() {
  const { data: session } = useSession();

  return (
    <div className="flex items-center justify-center">
      <div className="container">
        <h1 className="title">
          <svg
            className="icon"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.5 12h9m0 0H7.5m9 0a4.5 4.5 0 100-9H9A4.5 4.5 0 007.5 12m9 0V21l-4.5-4.5H9a4.5 4.5 0 110-9"
            />
          </svg>
          アカウント情報
        </h1>

        {/* ユーザー名の表示 */}
        <div className="user-info">
          <p className="user-name">ユーザー: {session?.user?.name || '読み込み中...'}</p>
        </div>

        {/* ログアウトボタン */}
        <button className="logout-button" onClick={() => signOut({ callbackUrl: "/" })}>ログアウト</button>        
      </div>

      <style jsx>{`
        .container {
          max-width: 760px;
          margin: 50px auto;
          padding: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          text-align: center;
          font-family: Arial, sans-serif;
          color: #333;
        }
        .title {
          font-size: 28px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .icon {
          width: 28px;
          height: 28px;
          color: #ff5a8d;
        }
        .user-info {
          margin: 20px 0;
        }
        .user-name {
          font-size: 18px;
          color: #666;
          margin: 0;
        }
        .logout-button {
          margin-top: 20px;
          padding: 10px 20px;
          font-size: 16px;
          color: white;
          background-color: #ff5a8d;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .logout-button:hover {
          background-color: #e04876;
        }
      `}</style>
    </div>
  );
}
