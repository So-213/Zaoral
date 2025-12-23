// ./components/Navbar.tsx
"use client";

import { usePageLoading } from "@/hooks/usePageLoading";
import { useMenuState } from "@/hooks/useMenuState";
import LoadingOverlay from "./LoadingOverlay";
import MenuOverlay from "./MenuOverlay";
import HamburgerButton from "./HamburgerButton";
import NavigationMenu from "./NavigationMenu";



export default function Navbar() {
  const { isLoading, startLoading } = usePageLoading();
  const { isOpen, closeMenu, toggleMenu, handleLinkClick } = useMenuState();

  // ログインページではナビゲーションを表示しない
  if (typeof window !== 'undefined' && window.location.pathname === "/login") return null;

  return (
    <>
      <LoadingOverlay isLoading={isLoading} />
      <MenuOverlay isOpen={isOpen} onClose={closeMenu} />
      
      <nav className="fixed top-2.5 left-2.5 bg-pink-200 p-2 rounded-lg shadow-lg z-[1000]">
        <HamburgerButton isOpen={isOpen} onToggle={toggleMenu} />
        <NavigationMenu 
          isOpen={isOpen} 
          onLinkClick={(href) => handleLinkClick(href, startLoading)} 
        />
      </nav>
    </>
  );
}
