"use client";

import Image from "next/image";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useCart, Food } from "@/context/CartContext";

export default function TopFoodCard({ food }: { food: Food }) {
  const { state, dispatch } = useCart();
  const item = state.items.find((i) => i._id === food._id);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl bg-white/70 shadow-xl ring-1 ring-black/5 backdrop-blur-md transition-all duration-300 hover:shadow-2xl dark:bg-neutral-900/60 dark:ring-white/10">
      {/* animated gradient glow border */}
      <span className="pointer-events-none absolute inset-px rounded-[inherit] bg-[conic-gradient(var(--tw-gradient-stops))] from-fuchsia-500 via-rose-500 to-orange-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>

      {/* CARD CONTENT */}
      <div className="relative flex flex-1 flex-col p-4">
        {/* image with zoom‑in on hover */}
        <div className="relative h-44 w-full overflow-hidden rounded-xl">
          <Image
            src={food.image}
            alt={food.name}
            fill
            sizes="(max-width:768px) 100vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            priority
          />
        </div>

        {/* TEXT */}
        <h3 className="mt-4 mb-1 truncate text-lg font-semibold capitalize">
          {food.name}
        </h3>

        {food.description && (
          <p className="mb-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
            {food.description}
          </p>
        )}

        <p className="mb-4 text-xl font-bold text-orange-400">
          ₹{food.offerPrice ?? food.price}
          {food.offerPrice && (
            <span className="ml-2 text-sm font-medium text-gray-500 line-through">
              ₹{food.price}
            </span>
          )}
        </p>

        {/* CART CONTROLS */}
        {!item ? (
          <button
            className="mt-auto flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-200 via-orange-500 to-orange-400 px-4 py-2 text-white shadow focus:outline-none focus:ring-2 focus:ring-emerald-400"
            onClick={() => dispatch({ type: "ADD_TO_CART", payload: food })}
          >
            <ShoppingCart size={18} />
            Add
          </button>
        ) : (
          <div className="mt-auto flex items-center justify-center gap-4">
            <button
              onClick={() =>
                dispatch({ type: "DECREASE_QUANTITY", payload: food._id })
              }
              className="grid h-8 w-8 place-items-center rounded-full bg-red-50 text-red-600 shadow hover:bg-red-100 dark:bg-red-900/40 dark:text-red-400"
            >
              <Minus size={16} />
            </button>
            <span className="text-lg font-semibold">{item.quantity}</span>
            <button
              onClick={() =>
                dispatch({ type: "INCREASE_QUANTITY", payload: food._id })
              }
              className="grid h-8 w-8 place-items-center rounded-full bg-emerald-50 text-emerald-600 shadow hover:bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-400"
            >
              <Plus size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
