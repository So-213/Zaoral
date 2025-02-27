"use client";

import Image from "next/image";
import Link from "next/link";

export default function ZaoralPage() {
  return (
    <div className="bg-gradient min-h-screen flex items-center justify-center">
      <div className="container">
        <h1 className="title">
          <svg className="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 12h9m0 0H7.5m9 0a4.5 4.5 0 100-9H9A4.5 4.5 0 007.5 12m9 0V21l-4.5-4.5H9a4.5 4.5 0 110-9" />
          </svg>
          Zaoralとは
        </h1>

        <p>ナンパやマッチングアプリをする男達のための「女の返信を促すサービス」です。</p>
        <p>ナンパやマッチングアプリをしていると、沢山の女とLINEを交換すると思います。</p>
        <p>その中にはすぐに返信をくれなかったり、未読/既読スルーしがちな女が一定数います。</p>
        <p>そのような女達に対して、メッセージ（いわゆる追いLINE）をWebページ化することで興味を惹き、返信させると共に、既読/未読スルーされることを防ぎます。</p>

        <Image src="/zaoral.png" alt="Zaoral ロゴ" width={300} height={150} className="zaoral-image" />

        <Link href="/" className="button">ホームに戻る</Link>
      </div>

      <style jsx>{`
        .bg-gradient {
          background: linear-gradient(to bottom right, #fff5f7, #faf0ff);
        }
        .container {
          max-width: 700px;
          margin: 50px auto;
          padding: 30px;
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
        p {
          text-align: left;
          font-size: 16px;
          line-height: 1.8;
          max-width: 90%;
          margin: 0 auto;
          white-space: normal;
          overflow-wrap: break-word;
        }
        .button {
          display: block;
          width: 100%;
          max-width: 280px;
          margin: 20px auto;
          padding: 12px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: bold;
          text-decoration: none;
          text-align: center;
          color: white;
          background: linear-gradient(to right, #ff5a8d, #b832ff);
          transition: 0.3s;
        }
        .button:hover {
          background: linear-gradient(to right, #e0487a, #9b2ddf);
        }
        .zaoral-image {
          display: block;
          max-width: 90%;
          height: auto;
          margin: 20px auto;
        }
      `}</style>
    </div>
  );
}
