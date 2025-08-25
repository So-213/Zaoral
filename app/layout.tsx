// ./app/layout.tsx

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";
import BackgroundWrapper from "@/components/BackgroundWrapper";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Navbar/>
          <BackgroundWrapper>
            {children}
          </BackgroundWrapper>
          <Toaster />
        </SessionProvider> 
      </body>
    </html>
  );
}




