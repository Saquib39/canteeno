"use client";

import { useSession } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}



export default function PlaceOrderPage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";
  const { state, dispatch } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!session) router.replace("/login");
  }, [session, router]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const total = state.items.reduce(
    (t, i) => t + (i.offerPrice ?? i.price) * i.quantity,
    0
  );

  const [delivery, setDelivery] = useState("pickup");
  const [slot, setSlot] = useState("asap");
  const [instructions, setInstructions] = useState("");
  const [classroom, setClassroom] = useState("");
  const [loading, setLoading] = useState(false);

  const createOrder = async (paymentStatus: boolean) => {
    const res = await fetch("/api/order/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: state.items,
        amount: total,
        paymentStatus,
        deliveryMethod: delivery,
        slot,
        instructions,
        classroom,
      }),
    });

    const data = await res.json();
    if (data.success) {
      dispatch({ type: "CLEAR_CART" });
      router.push("/my-orders");
    }
  };

  const handleRazorpayPayment = async () => {
    setLoading(true);
    const res = await fetch("/api/razorpay-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: total }),
    });

    const data = await res.json();
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: data.currency,
      name: "Canteeno",
      description: "Order Payment",
      order_id: data.id,
      handler: async function (response: any) {
        alert("Payment successful!");
        await createOrder(true); // ✅ Paid order
      },
      prefill: {
        name: session?.user?.name || "",
        email: session?.user?.email || "",
      },
      theme: { color: "#38bdf8" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
    setLoading(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    await createOrder(false); // ❌ Unpaid order
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="container mx-auto max-w-4xl p-6"
    >
      <h1 className="text-3xl font-bold mb-6 text-center">Place Your Order</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Cart Summary */}
        <Card className="md:row-span-2 shadow-lg">
          <CardHeader>
            <CardTitle>Cart Summary</CardTitle>
            <CardDescription>
              Review your selected items before confirming.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[360px] overflow-y-auto pr-2">
            {state.items.map((item) => (
              <motion.div
                key={item._id}
                layout
                className="flex gap-4 items-center"
              >
                <div className="relative w-16 h-16 shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded-md"
                    sizes="64px"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium capitalize leading-tight">
                    {item.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Qty: {item.quantity}
                  </p>
                </div>
                <p className="font-semibold">
                  ₹{(item.offerPrice ?? item.price) * item.quantity}
                </p>
              </motion.div>
            ))}
          </CardContent>
          <CardFooter className="flex justify-between pt-4 border-t">
            <span className="font-semibold text-lg">Total</span>
            <span className="font-bold text-xl text-green-600">₹{total}</span>
          </CardFooter>
        </Card>

        {/* Delivery Options */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Delivery Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Delivery method</label>
              <Select value={delivery} onValueChange={setDelivery}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select delivery method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pickup">Pickup (Counter)</SelectItem>
                  <SelectItem value="classroom">Deliver to Table</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {delivery === "classroom" && (
              <Input
                placeholder="Enter classroom / hall"
                value={classroom}
                onChange={(e) => setClassroom(e.target.value)}
              />
            )}

            <div>
              <label className="block mb-1 font-medium">Time slot</label>
              <Select value={slot} onValueChange={setSlot}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose time slot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asap">ASAP (≈15 min)</SelectItem>
                  <SelectItem value="30">In 30 min</SelectItem>
                  <SelectItem value="60">In 1 hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Special Instructions */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Special Instructions</CardTitle>
            <CardDescription>Optional</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="No onions, less spicy, etc."
            />
          </CardContent>
        </Card>
      </div>

      {/* Buttons */}
      <div className="mt-8 flex justify-end gap-4">
        <Button variant="outline" onClick={handleSubmit} disabled={loading}>
          Pay Later
        </Button>
        <Button  disabled={loading || !isAdmin} onClick={handleRazorpayPayment}>
          {loading ? "Placing…" : "Proceed to Payment"}
        </Button>
      </div>
      <div className="text-red-500 text-center">razorpay is disable in demo mode click on pay later for order</div>
    </motion.div>
  );
}
