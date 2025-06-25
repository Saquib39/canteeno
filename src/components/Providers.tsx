"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { CartProvider } from "@/context/CartContext";
import Navbar from "./Navbar";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider>
        <CartProvider>
          <Navbar />
          <main className="pt-16">{children}</main>
        </CartProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
