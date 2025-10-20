import { useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * ナビゲーションメニューの開閉状態を管理するカスタムフック
 */
export function useMenuState() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const openMenu = () => setIsOpen(true);
  const closeMenu = () => setIsOpen(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  // メニュー内のリンククリック時の処理
  const handleLinkClick = (href: string, startLoading: () => void) => {
    closeMenu();
    
    // 同じページに飛ぶ場合はリロード
    if (pathname === href) {
      window.location.reload();
      return;
    }
    
    startLoading();
  };

  return {
    isOpen,
    openMenu,
    closeMenu,
    toggleMenu,
    handleLinkClick,
  };
}
