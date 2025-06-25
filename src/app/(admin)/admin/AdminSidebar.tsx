"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Menu, Home, ListOrdered, Package,PlusSquareIcon} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Dashboard", icon: Home },
    { href: "/admin/orders-paid", label: "Orders Paid", icon: ListOrdered },
    { href: "/admin/orders-unpaid", label: "Orders Unpaid", icon: ListOrdered },
    { href: "/admin/productList", label: "Products", icon: Package },
    { href: "/admin/add-main-category", label: "Add Main Category", icon: PlusSquareIcon },
    { href: "/admin/add-sub-category", label: "Add Sub-Category", icon: PlusSquareIcon},
    { href: "/admin/add-food", label: "Add Foods", icon:PlusSquareIcon },
  ];

  return (
    <div>
      {/* ✅ Trigger button only on small screens */}
      <div   className="md:hidden fixed top-4 left-4 z-50">
        <Sheet>
          <SheetTrigger className="p-2 rounded-md bg-white shadow-md dark:bg-neutral-900">
            <Menu className="h-5 w-5 text-gray-700 dark:text-white" />
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader className="border-b px-4 py-3">
              <SheetTitle className="text-lg font-bold mt-16 text-green-600">
                Admin panel
              </SheetTitle>
            </SheetHeader>
            <nav className="p-4 space-y-2">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md transition hover:bg-green-100 dark:hover:bg-neutral-800",
                      isActive
                        ? "bg-green-200 text-green-800 dark:bg-green-800 dark:text-white font-semibold"
                        : "text-gray-800 dark:text-gray-200"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/*  Sidebar always visible on desktop */}
      <aside className="hidden md:block fixed mt-16 top-0 left-0 h-screen w-64 bg-white dark:bg-neutral-900 border-r z-40 px-4 py-6">

        <h2 className="text-lg font-bold  text-green-600 mb-6">Admin Panel</h2>
        <nav className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition hover:bg-green-100 dark:hover:bg-neutral-800",
                  isActive
                    ? "bg-green-200 text-green-800 dark:bg-green-800 dark:text-white font-semibold"
                    : "text-gray-800 dark:text-gray-200"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}
