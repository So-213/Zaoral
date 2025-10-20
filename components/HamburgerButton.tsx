interface HamburgerButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * ハンバーガーメニューボタンコンポーネント
 */
export default function HamburgerButton({ isOpen, onToggle }: HamburgerButtonProps) {
  return (
    <button 
      className="text-2xl bg-transparent border-none cursor-pointer text-rose-500" 
      onClick={onToggle}
      aria-label={isOpen ? "メニューを閉じる" : "メニューを開く"}
    >
      ☰
    </button>
  );
}
