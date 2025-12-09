import Image from "next/image";


export default function ZaoralPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fff5f7] to-[#faf0ff]">
      <div className="max-w-[760px] mx-auto my-[50px] p-5 bg-white rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.1)] text-center font-sans text-[#333]">
        <h1 className="text-[28px] font-bold flex items-center justify-center gap-2.5">
          <svg 
            className="w-7 h-7 text-[#ff5a8d]" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none"
            width="28" 
            height="28" 
            viewBox="0 0 24 24" 
            strokeWidth="1.5" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 12h9m0 0H7.5m9 0a4.5 4.5 0 100-9H9A4.5 4.5 0 007.5 12m9 0V21l-4.5-4.5H9a4.5 4.5 0 110-9" />
          </svg>
          Zaoralとは
        </h1>
        <br></br>
        <br></br>
        <br></br>
        <p className="text-left text-base leading-[1.8] max-w-[90%] mx-auto whitespace-normal break-words">
          ホストやマッチングアプリをする男達のための
          <span className="text-[rgb(255,90,90)] font-bold bg-[#fff0f5] px-1.5 py-0.5 rounded">
            「女性の返信を促すサービス」
          </span>
          です。
        </p>
        <br></br>
        <p className="text-left text-base leading-[1.8] max-w-[90%] mx-auto whitespace-normal break-words">
          ホストやマッチングアプリをしていると、沢山の女性とLINEを交換すると思います。
        </p>
        <br></br>
        <p className="text-left text-base leading-[1.8] max-w-[90%] mx-auto whitespace-normal break-words">
          その中にはすぐに返信をくれなかったり、未読/既読スルーしがちな人が一定数います。
        </p>
        <br></br>
        <p className="text-left text-base leading-[1.8] max-w-[90%] mx-auto whitespace-normal break-words">
          そのような女性に対して、
          <span className="text-[rgb(255,90,90)] font-bold bg-[#fff0f5] px-1.5 py-0.5 rounded">
            メッセージ（いわゆる追いLINE）をWebページ化
          </span>
          することで興味を惹き、返信させると共に、既読/未読スルーされることを防ぎます。
        </p>
        <br></br>

        <div className="flex justify-center items-center my-5">
          <Image 
            src="/zaoral.png" 
            alt="Zaoral ロゴ" 
            width={800}
            height={150} 
            className="block max-w-[90%] h-auto mx-auto my-5" 
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
    </div>
  );
}
