"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; // Make sure this path is correct
import foodModel from "@/models/foodModel";

export default function CartPage() {
  const { state, dispatch } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  const totalPrice = state.items.reduce(
    (total, item) => total + (item.offerPrice ?? item.price) * item.quantity,
    0
  );

  const handlePlaceOrder = () => {
    if (session) {
      router.push("/placeOrder");
    } else {
      router.push("/login");
    }
  };

  if (!state.items.length) {
    return (
      <div className="p-6 text-center text-gray-600">Your cart is empty 🛒</div>
    );
  }

  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      <div className="grid gap-4">
        {state.items.map((item) => (
          <div
            key={item._id}
            className="flex items-center gap-4 border p-4 rounded-lg shadow"
          >
            <div className="relative w-28 h-20">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 768px) 100vw, 112px" // 👈 recommended value for w-28
                className="object-cover rounded"
              />
            </div>

            <div className="flex-1">
              <h2 className="font-semibold capitalize">{item.name}</h2>
              <p className="text-green-600 font-medium">
                ₹{item.offerPrice ?? item.price}{" "}
                {item.offerPrice && (
                  <span className="line-through text-sm text-gray-500 ml-2">
                    ₹{item.price}
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  dispatch({ type: "DECREASE_QUANTITY", payload: item._id })
                }
                className="text-red-500 hover:text-red-700"
              >
                <Minus size={18} />
              </button>
              <span className="font-medium">{item.quantity}</span>
              <button
                onClick={() =>
                  dispatch({ type: "INCREASE_QUANTITY", payload: item._id })
                }
                className="text-green-500 hover:text-green-700"
              >
                <Plus size={18} />
              </button>
            </div>
            <button
              onClick={() =>
                dispatch({ type: "REMOVE_FROM_CART", payload: item._id })
              }
              className="text-gray-400 hover:text-red-600 ml-4"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 text-right text-xl font-semibold">
        Total: ₹{totalPrice}
      </div>

      {/* Buttons */}
      <div className="mt-6 flex justify-end gap-4">
        <Button
          onClick={handlePlaceOrder}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          Proceed to Payment
        </Button>
        <Button onClick={handlePlaceOrder} variant="outline">
          Pay Later
        </Button>
      </div>
    </section>
  );
}
