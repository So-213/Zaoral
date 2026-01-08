'use client';

import { signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface AccountClientProps {
  session: any;
  userPlan: string;
}

export default function AccountClient({ session, userPlan }: AccountClientProps) {
  const router = useRouter();
  const [isChangingPlan, setIsChangingPlan] = useState(false);
  const planDisplayName = userPlan === 'PREMIUM' ? 'Premium' : 'Free';
  const planBadgeClass = userPlan === 'PREMIUM' ? 'premium-badge' : 'free-badge';
  const targetPlan = userPlan === 'PREMIUM' ? 'FREE' : 'PREMIUM';
  const targetPlanDisplayName = targetPlan === 'PREMIUM' ? 'Premium' : 'Free';

  const handlePlanChange = async () => {
    if (isChangingPlan) return;

    const confirmMessage = userPlan === 'PREMIUM' 
      ? 'PremiumプランからFreeプランに変更しますか？'
      : 'FreeプランからPremiumプランに変更しますか？';
    
    if (!confirm(confirmMessage)) {
      return;
    }

    setIsChangingPlan(true);

    try {
      const response = await fetch('/api/account/plan', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan: targetPlan }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'プランの変更に失敗しました');
        return;
      }

      // 成功したらページをリロードして最新のプラン情報を表示
      router.refresh();
    } catch (error) {
      console.error('プラン変更エラー:', error);
      alert('プランの変更中にエラーが発生しました');
    } finally {
      setIsChangingPlan(false);
    }
  };

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
          <p className="user-name">ユーザー: {session?.user?.name || session?.user?.email}</p>
        </div>

        {/* プラン情報の表示 */}
        <div className="plan-info">
          <div className="plan-display">
            <p className="plan-label">プラン:</p>
            <span className={planBadgeClass}>{planDisplayName}</span>
          </div>
          
          {/* プラン変更ボタン */}
          <button 
            className="plan-change-button" 
            onClick={handlePlanChange}
            disabled={isChangingPlan}
          >
            {isChangingPlan ? '変更中...' : `${targetPlanDisplayName}プランに変更`}
          </button>
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
        .plan-info {
          margin: 20px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 15px;
        }
        .plan-display {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .plan-label {
          font-size: 18px;
          color: #666;
          margin: 0;
        }
        .free-badge {
          display: inline-block;
          padding: 6px 16px;
          font-size: 16px;
          font-weight: bold;
          color: #666;
          background-color: #f0f0f0;
          border-radius: 20px;
        }
        .premium-badge {
          display: inline-block;
          padding: 6px 16px;
          font-size: 16px;
          font-weight: bold;
          color: white;
          background: linear-gradient(135deg, #ff5a8d 0%, #ff8c42 100%);
          border-radius: 20px;
          box-shadow: 0 2px 8px rgba(255, 90, 141, 0.3);
        }
        .plan-change-button {
          margin-top: 0;
          padding: 10px 20px;
          font-size: 16px;
          color: white;
          background-color:rgb(223, 114, 204);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .plan-change-button:hover:not(:disabled) {
          background-color:rgb(232, 71, 176);
        }
        .plan-change-button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
          opacity: 0.6;
        }
        .logout-button {
          margin-top: 20px;
          padding: 10px 20px;
          font-size: 16px;
          color: white;
          background-color:rgb(240, 108, 150);
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
