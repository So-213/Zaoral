"use client";

import Image from "next/image";
import Link from "next/link";

export default function FromAuthorPage() {
  return (
    <div className="bg-gradient min-h-screen flex items-center justify-center">
      <div className="container">
        <h1 className="title">
        <svg className="icon" xmlns="http://www.w3.org/2000/svg" fill="none"
            width="28" height="28" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 12h9m0 0H7.5m9 0a4.5 4.5 0 100-9H9A4.5 4.5 0 007.5 12m9 0V21l-4.5-4.5H9a4.5 4.5 0 110-9" />
        </svg>
          サイト制作者より
        </h1>
        <br></br>
        <br></br>
        <br></br>
        
        <p>初めまして。当サイトを運営しております「さいとー」でございます。</p>
        <br></br>
        <p>まずは、当サイトにお越しいただき誠にありがとうございます。
        皆様の閲覧が励みになっております。</p>
        <div className="image-container">
          <Image 
            src="/dgz.png" 
            alt="土下座" 
            width={150}
            height={150} 
            className="dgz-image" 
          />
        </div>
        <br></br>
        <p>さて、当サイトはナンパやマッチングアプリをする男性の皆様のためのサービスを提供しております。</p>
        <br></br>
        <p>ナンパやアプリで女性とLINE交換をしたものの、既読/未読スルーが多すぎるという問題をどうにかしたいという願いから発足いたしました。</p>
        <br></br>
        <p>私自身もたまーにナンパをしているのですが、LINEには「何の返信もない女」が溜まっていく一方なので、皆様と同じ感情になっていると思います（たぶん笑）。</p>
        <br></br>
        <p>というわけで、当サイトを活用していただき、快適な女遊びライフを送っていただけたらと思います。</p>        
        <br></br>
        <br></br>
        <p><strong>P.S.</strong></p>
        <p>当サイトは大学を卒業したばかりのアマチュアエンジニアが運営しておりますゆえ、
        何かとトラブルがあると思います。その場合は何卒温かい気持ちで復旧を待っていただけたらと思います。</p>

        <br></br>
        <br></br>
        <Link href="/" className="button">ホームに戻る</Link>
      </div>

      <style jsx>{`
        .bg-gradient {
          background: linear-gradient(to bottom right, #fff5f7, #faf0ff);
        }
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
          margin-top: 40px;
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
        .image-container {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 20px 0;
        }
        .dgz-image {
          display: block;
          max-width: 90%;
          height: auto;
          margin: 20px auto;
        }
      `}</style>
    </div>
  );
}
