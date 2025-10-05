// ./app/layout.tsx

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";
import BackgroundWrapper from "@/components/BackgroundWrapper";
import BrowserDetectionProvider from "@/components/BrowserDetectionProvider";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <BrowserDetectionProvider>
            <Navbar/>
            <BackgroundWrapper>
              {children}
            </BackgroundWrapper>
            <Toaster />
          </BrowserDetectionProvider>
        </SessionProvider> 
      </body>
    </html>
  );
}




