// app/(user)/account/pay-later/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
 
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PayLaterPage() {
  
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.role === "admin";
  const router = useRouter();

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------------------------------- auth & fetch --------------------------------- */
  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
    if (status === "authenticated") fetchOrders();
  }, [status]);
  useEffect(() => {
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.async = true;
  document.body.appendChild(script);
}, []);
  async function fetchOrders() {
    const res = await fetch("/api/order/my-orders");
    const json = await res.json();
    const unpaidOnly = json.data.filter((o: any) => o.paymentStatus === "unpaid");
    setOrders(unpaidOnly);
    setLoading(false);
  }

  /* ----------------------------- Razorpay “Pay Now” flow ---------------------------- */
  async function handlePayNow(order: any) {
    /* 1️⃣  Create a Razorpay order on server */
    const res = await fetch("/api/razorpay-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: order.amount }),
    });
    const data = await res.json();         // ← data = raw Razorpay order object

    if (!data?.id) {
      alert("Something went wrong (order not created)");
      return;
    }

    /* 2️⃣  Open Razorpay checkout */
    const rzp = new window.Razorpay({
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: data.currency,
      name: "Canteeno",
      description: "Order Payment",
      order_id: data.id,
      prefill: { email: session?.user?.email ?? "" },
      theme: { color: "#60c878" },

      /* 3️⃣  Success handler → mark order paid */
      handler: async () => {
        await fetch(`/api/order/${order._id}/order-paid`, { method: "PATCH" });
        fetchOrders();         // refresh list
        alert("✅ Payment successful!");
      },
    });

    rzp.open();
  }

  /* ---------------------------------- UI render ---------------------------------- */
  if (loading)                     return <p className="p-6 text-center">Loading…</p>;
  if (orders.length === 0)         return <p className="p-6 text-center">No pending payments.</p>;

  return (
    <section className="max-w-3xl mx-auto p-6 space-y-6">
      {orders.map((o: any) => (
        <Card key={o._id} className="shadow">
          <CardHeader className="flex-row justify-between items-center">
            <CardTitle>#{o._id.slice(-6).toUpperCase()}</CardTitle>
            <Badge variant="destructive">Unpaid</Badge>
          </CardHeader>

          <CardContent className="space-y-2">
            {o.items.map((i: any) => (
              <div key={i._id /* unique key */} className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <Image
                    src={i.image}
                    alt={i.name}
                    width={40}
                    height={40}
                    className="rounded"
                  />
                  <p>{i.name}</p>
                </div>
                <p>x {i.quantity}</p>
              </div>
            ))}
          </CardContent>

          <CardFooter className="flex justify-between items-center">
            <p className="font-bold">₹ {o.amount}</p>
            <Button disabled = {!isAdmin} onClick={() => handlePayNow(o)}>Pay Now</Button>
          </CardFooter>
        </Card>
      ))}
    </section>
  );
}
