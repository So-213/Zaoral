interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

/**
 * ページ遷移時のローディングオーバーレイコンポーネント
 */
export default function LoadingOverlay({ isLoading, message = "読み込み中..." }: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 w-screen h-screen bg-white/80 z-[9999] flex justify-center items-center pointer-events-none">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-rose-500 rounded-full animate-spin mx-auto"></div>
        <p className="mt-2.5 text-rose-500 font-bold">{message}</p>
      </div>
    </div>
  );
}
