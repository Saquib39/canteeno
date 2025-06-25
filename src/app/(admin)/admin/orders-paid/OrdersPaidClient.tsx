"use client";

import useSWR from "swr";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useSession } from "next-auth/react";

  
/* ------------------------------------
   Helpers
------------------------------------ */

const fetcher = (url: string) => fetch(url).then(r => r.json());

type Order = {
  _id: string;
  createdAt: string;
  amount: number;
  deliveryMethod: string;
  orderStatus: string;
  user: { name: string; email: string };
  items: {
    _id: string;
    name: string;
    image: string;
    quantity: number;
  }[];
};

/* ------------------------------------
   Component
------------------------------------ */

export default function OrdersPaidClient() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  const { data, mutate, isLoading } = useSWR<{ data: Order[] }>(
    "/api/order/admin/paid",
    fetcher,
    { refreshInterval: 30_000 } // auto‑refresh every 30 s
  );
  const [updating, setUpdating] = useState<string | null>(null);

  async function updateStatus(id: string, status: "delivered" | "cancelled") {
    setUpdating(id);
    await fetch(`/api/order/${id}/update-status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await mutate();           // re‑fetch
    setUpdating(null);
  }

  /* ------------------------------------
     Animation variants
  ------------------------------------ */
  const list = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  /* ------------------------------------ */

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );

  const orders = data?.data ?? [];

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Paid Orders</h1>

      {orders.length === 0 ? (
        <p className="text-muted-foreground">No paid orders.</p>
      ) : (
        <AnimatePresence>
          <motion.ul
            variants={list}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {orders.map((o) => (
              <motion.li key={o._id} variants={item} exit={{ opacity: 0 }}>
                <Card className="hover:shadow-xl transition-shadow">
                  <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <CardTitle>#{o._id.slice(-6).toUpperCase()}</CardTitle>

                    <div className="flex flex-wrap gap-2 md:justify-end">
                      <Badge variant="secondary">Paid</Badge>
                      <Badge variant="outline">{o.orderStatus}</Badge>
                      <span className="text-sm text-muted-foreground">
                        <span className="font-medium">{o.user?.name}</span>
                        <span className="ml-1">({o.user?.email})</span>
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {o.items.map((i) => (
                      <div
                        key={i._id}
                        className="flex flex-wrap md:flex-nowrap justify-between gap-2"
                      >
                        <div className="flex items-center gap-3">
                          <Image
                            src={i.image}
                            alt={i.name}
                            width={40}
                            height={40}
                            className="rounded object-cover"
                          />
                          <p>{i.name}</p>
                        </div>

                        <p className="font-medium">×{i.quantity}</p>

                        <span className="text-sm text-muted-foreground">
                          {new Date(o.createdAt).toLocaleDateString("en-GB")}
                        </span>
                      </div>
                    ))}
                  </CardContent>

                  <CardFooter className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
                    <span className="font-semibold text-lg">
                      ₹{o.amount.toLocaleString()}
                    </span>

                    <span className="font-medium">{o.deliveryMethod}</span>

                    <div className="flex gap-3">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-green-600 flex gap-1"
                        // disabled={updating === o._id}
                        disabled={!isAdmin}
                        onClick={() => updateStatus(o._id, "delivered")}
                      >
                        {updating === o._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4" />
                        )}
                        Delivered
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600 flex gap-1"
                        // disabled={updating === o._id}
                        disabled={!isAdmin}
                        onClick={() => updateStatus(o._id, "cancelled")}
                      >
                        {updating === o._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                        Cancel
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
      )}
    </main>
  );
}
