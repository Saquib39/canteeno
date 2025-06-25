import "@/app/globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "./AdminSidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const session = await getServerSession(authOptions);
  // if (!session || session.user.role !== "admin") redirect("/");

  return (
    <div className="flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 ml-0 md:ml-64 p-6">
        {" "}
        {/* mt-16 to push below navbar */}
        {children}
      </main>
    </div>
  );
}
