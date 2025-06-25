"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/order/my-orders")
      .then((res) => res.json())
      .then((data) => setOrders(data.data ?? []));
  }, []);

  return (
    <main className="max-w-5xl mx-auto p-6 mt-20 space-y-6">
      <h1 className="text-2xl font-bold">My Orders</h1>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((order) => (
          <Card key={order._id}>
            <CardHeader className="flex justify-between items-center">
              <div>
                <CardTitle>#{order._id.slice(-6).toUpperCase()}</CardTitle>
                {/* ✅ Show user email */}
                <p className="text-sm text-muted-foreground">
                  {order.user?.email}
                </p>
              </div>
              <div className="flex gap-2">
                <Badge
                  className={
                    order.paymentStatus === "paid"
                      ? "bg-green-500"
                      : "bg-yellow-500"
                  }
                >
                  {order.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                </Badge>

                <Badge variant="outline">{order.orderStatus}</Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-2">
              {order.items.map((item: any) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center"
                >
                  <div className="flex gap-2 items-center">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={38}
                      height={38}
                      className="rounded"
                    />
                    <p>{item.name}</p>
                  </div>
                  <p>x{item.quantity}</p>
                </div>
              ))}
            </CardContent>

            <CardFooter className="flex justify-between">
              <span className="font-bold">₹{order.amount}</span>
              <span className="text-sm text-muted-foreground">
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </span>
            </CardFooter>
          </Card>
        ))
      )}
    </main>
  );
}
