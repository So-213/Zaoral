interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * メニューが開いている時のオーバーレイコンポーネント
 */
export default function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 w-screen h-screen bg-black/30 z-[999] cursor-pointer" 
      onClick={onClose}
    />
  );
}
