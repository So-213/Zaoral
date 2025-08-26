"use client";

import Image from "next/image";


export default function ZaoralPage() {
  return (
    <div className="bg-gradient min-h-screen flex items-center justify-center">
      <div className="container">
        <h1 className="title">
        <svg className="icon" xmlns="http://www.w3.org/2000/svg" fill="none"
            width="28" height="28" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 12h9m0 0H7.5m9 0a4.5 4.5 0 100-9H9A4.5 4.5 0 007.5 12m9 0V21l-4.5-4.5H9a4.5 4.5 0 110-9" />
        </svg>
          Zaoralとは
        </h1>
        <br></br>
        <br></br>
        <br></br>
        <p>ナンパやマッチングアプリをする男達のための<span className="highlight">「女性の返信を促すサービス」</span>です。</p>
        <br></br>
        <p>ナンパやマッチングアプリをしていると、沢山の女性とLINEを交換すると思います。</p>
        <br></br>
        <p>その中にはすぐに返信をくれなかったり、未読/既読スルーしがちな人が一定数います。</p>
        <br></br>
        <p>そのような女性に対して、<span className="highlight">メッセージ（いわゆる追いLINE）をWebページ化</span>することで興味を惹き、返信させると共に、既読/未読スルーされることを防ぎます。</p>
        <br></br>

        <div className="image-container">
          <Image 
            src="/zaoral.png" 
            alt="Zaoral ロゴ" 
            width={800}
            height={150} 
            className="zaoral-image" 
          />
        </div>
        {/* <br></br>
        <br></br>
        <br></br>
        <p><strong>《作成できるWebページ》</strong></p>
        <br></br>
        <br></br>
        <br></br>
        <p>※Webページは2週間で自動的に消去されます。</p> */}
        {/* <p>月2ページまでは永久保存版として作成できます。</p> */}

        {/* <br></br>
        <br></br>
        <br></br>

        <p><strong>《プラン》</strong></p>

        <br></br>
        <br></br>
        <br></br> */}






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
        .highlight {
          color:rgb(255, 90, 90); /* ピンク系の強調色 */
          font-weight: bold;
          background-color: #fff0f5; /* 薄いピンクの背景 */
          padding: 2px 5px;
          border-radius: 4px;
        }
        .image-container {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 20px 0;
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
