// ./app/layout.tsx

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Navbar/>
          {children}
          <Toaster />
        </SessionProvider> 
      </body>
    </html>
  );
}




