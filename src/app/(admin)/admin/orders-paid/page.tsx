// app/(admin)/admin/order-paid/page.tsx
export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import OrdersPaidClient from "./OrdersPaidClient";

export default async function OrdersPaidPage() {
  const session = await getServerSession(authOptions);

  // 🔒 redirect anyone who isn’t an admin
  // if (!session || session.user.role !== "admin") redirect("/");

  return <OrdersPaidClient />;
}
