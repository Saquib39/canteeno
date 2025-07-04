// ❌ No "use client" here
import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Canteeno – Fresh Campus Meals",
  description: "Get delicious food from your canteen with ease.",
  icons: {
    icon: "/favico.ico", // ✅ Also here for SEO + default
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "Canteeno",
    description: "Explore canteen categories, meals, and combos.",
    images: ["/og/home.png"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og/home.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* ✅ Favicon PNG */}
        <link rel="icon" type="image/png" href="/" />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
