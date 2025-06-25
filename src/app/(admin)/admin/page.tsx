export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminDashboardClient from "./AdminDashboardClient";
import DashboardCharts from "./AdminDashboardClient";
interface SidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default async function AdminPage() {
  // const session = await getServerSession(authOptions);
  // if (!session || session.user.role !== "admin") redirect("/");
  return(
    <>
        <AdminDashboardClient />
       
    </>
  ) 
}
