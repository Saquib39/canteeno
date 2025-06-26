"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingCart } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // 🔗 Cart quantity
  const {
    state: { items },
  } = useCart();
  const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);

  // ✅ avoid hydration mismatch
  if (status === "loading") return null;

  const linkClass = (path: string) =>
    `block transition hover:underline ${
      pathname === path
        ? "text-green-500 font-semibold"
        : "text-gray-800 dark:text-white"
    }`;

  // 🔸 cart icon + badge (component to reuse in desktop/mobile)
  const CartIcon = (
    <span className="relative text-gray-800 dark:text-white hover:text-green-500 transition">
      <ShoppingCart size={22} />
      {totalQty > 0 && (
        <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {totalQty}
        </span>
      )}
    </span>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-[12px] bg-white/10 dark:bg-black/10 border-b border-white/20 dark:border-white/10 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* logo */}
        <Link
          href="/"
          className="text-xl font-bold text-gray-800 dark:text-white"
        >
          Canteeno
        </Link>

        {/* desktop */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/menu" className={linkClass("/menu")}>
            Menu
          </Link>
          <Link href="/my-orders" className={linkClass("/my-orders")}>
            Orders
          </Link>
          <Link href="/account" className={linkClass("/account")}>
            Bills
          </Link>

          {/* admin – only for admins */}
          {/* {session?.user?.role === "admin" && ( */}
            <Link href="/admin" className={linkClass("/admin")}>
              Admin
            </Link>
          {/* )} */}

          {/* login/logout */}
          {session ? (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-red-500 hover:underline transition"
            >
              Logout
            </button>
          ) : (
            <Link href="/login" className={linkClass("/login")}>
              Login
            </Link>
          )}

          <Link href="/cart">{CartIcon}</Link>
          <ModeToggle />
        </div>

        {/* mobile toggle */}
        {/* <button
          className="md:hidden text-gray-800 dark:text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button> */}
                {/* mobile cart + toggle */}
        <div className="md:hidden flex items-center gap-4">
          <Link href="/cart">{CartIcon}</Link>
          <button
            className="text-gray-800 dark:text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>

      {/* mobile drawer */}
      {isOpen && (
        <div className="md:hidden px-4 py-4 bg-white/30 dark:bg-black/30 backdrop-blur-[16px] shadow-md border-t border-white/20 dark:border-white/10 space-y-3">
          <Link href="/menu" className={linkClass("/menu")}>
            Menu
          </Link>
          <Link href="/my-orders" className={linkClass("/my-orders")}>
            Orders
          </Link>
          <Link href="/account" className={linkClass("/account")}>
            Bills
          </Link>
          {/* {session?.user?.role === "admin" && ( */}
            <Link href="/admin" className={linkClass("/admin")}>
              Admin
            </Link>
          {/* )} */}
          {session ? (
            <button
              onClick={() => {
                setIsOpen(false);
                signOut({ callbackUrl: "/" });
              }}
              className="block text-red-500 hover:underline transition"
            >
              Logout
            </button>
          ) : (
            <Link href="/login" className={linkClass("/login")}>
              Login
            </Link>
          )}
          <div className="flex gap-4 items-center">
            {/* <Link href="/cart">{CartIcon}</Link> */}
            <ModeToggle />
          </div>
        </div>
      )}
    </nav>
  );
}
