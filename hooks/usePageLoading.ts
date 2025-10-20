import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * ページ遷移時のローディング状態を管理するカスタムフック
 */
export function usePageLoading() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  // ページ遷移の検知
  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    // カスタムイベントリスナーを追加
    window.addEventListener('beforeunload', handleStart);
    window.addEventListener('load', handleComplete);

    return () => {
      window.removeEventListener('beforeunload', handleStart);
      window.removeEventListener('load', handleComplete);
    };
  }, []);

  // パスが変更された時にローディングを停止
  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  // ローディング状態が開始されたら一定時間後に自動停止
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 3000); // 3秒後に自動停止

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  return {
    isLoading,
    startLoading,
    stopLoading,
  };
}
