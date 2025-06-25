"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import Image from "next/image";
import { useSession } from "next-auth/react";
export default function OrdersUnpaidPage() {
  const { data: session } = useSession();
    const isAdmin = session?.user?.role === "admin";
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    const res = await fetch("/api/order/admin/unpaid");
    const json = await res.json();
    setOrders(json.data ?? []);
  }

  async function updateStatus(id: string, status: "delivered" | "cancelled") {
    const res = await fetch(`/api/order/${id}/update-status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (data.success) {
      fetchOrders();
    } else {
      alert(data.message || "Failed to update status");
    }
  }

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Unpaid Orders</h1>
      {orders.length === 0 ? (
        <p>No unpaid orders.</p>
      ) : (
        orders.map((o: any) => (
          <Card key={o._id}>
            <CardHeader className="flex justify-between items-center">
              <CardTitle>#{o._id.slice(-6).toUpperCase()}</CardTitle>
              <div className="flex gap-2">
                <Badge variant="destructive">Unpaid</Badge>
                <Badge variant="outline">{o.orderStatus}</Badge>
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold">{o.user?.name}</span>
                  <span className="ml-1">({o.user?.email})</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {o.items.map((i: any) => (
                <div key={i._id} className="flex justify-between">
                  <div className="flex gap-2 items-center">
                    <Image
                      src={i.image}
                      alt={i.name}
                      width={38}
                      height={38}
                      className="rounded"
                    />
                    <p>{i.name}</p>
                  </div>
                  <p>x{i.quantity}</p>
                  <div className="text-sm text-muted-foreground">
                    {new Date(o.createdAt).toLocaleDateString("en-GB")}
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex justify-between">
              <span className="font-bold">₹{o.amount}</span>
              <span className="font-bold">{o.deliveryMethod}</span>
              <div className="flex gap-3 text-sm">
                <button
                  disabled={!isAdmin}
                  onClick={() => updateStatus(o._id, "delivered")}
                  className="text-green-600"
                >
                  Delivered
                </button>
                <button
                  disabled={!isAdmin}
                  onClick={() => updateStatus(o._id, "cancelled")}
                  className="text-red-600"
                >
                  Cancel
                </button>
              </div>
            </CardFooter>
          </Card>
        ))
      )}
    </main>
  );
}