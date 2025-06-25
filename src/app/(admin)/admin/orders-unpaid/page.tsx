import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import OrdersUnpaidClient from "./OrdersUnpaidClient";

export default async function OrdersUnpaidPage() {
  const session = await getServerSession(authOptions);

  // if (!session || session.user.role !== "admin") {
  //   redirect("/"); // ⛔ unauthorized
  // }

  return <OrdersUnpaidClient />;
}
