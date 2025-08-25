"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface BackgroundWrapperProps {
  children: ReactNode;
}

export default function BackgroundWrapper({ children }: BackgroundWrapperProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <div className={!isHomePage ? "bg-gradient min-h-screen" : ""}>
      {children}
      <style jsx>{`
        .bg-gradient {
          background: linear-gradient(to bottom right, #fff5f7, #faf0ff);
        }
      `}</style>
    </div>
  );
}
