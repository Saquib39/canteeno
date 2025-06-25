"use client";

import Image from "next/image";
import { Food } from "@/context/CartContext";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

export default function TopFoodCard({ food }: { food: Food }) {
  const { state, dispatch } = useCart();
  const item = state.items.find((i) => i._id === food._id);

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="rounded-2xl shadow-xl overflow-hidden bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 transition-all duration-300 group hover:shadow-2xl"
    >
      <div className="relative w-full h-48 overflow-hidden">
        <Image
          src={food.image}
          alt={food.name}
          fill 
          sizes="(max-width: 640px) 128px, 128px" 
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white capitalize mb-1">
          {food.name}
        </h3>
        {food.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
            {food.description}
          </p>
        )}

        <div className="mb-3">
          <span className="text-orange-400 dark:text-orange-400 font-bold">
            ₹{food.offerPrice ?? food.price}
          </span>
          {food.offerPrice && (
            <span className="text-gray-400 line-through text-sm ml-2">
              ₹{food.price}
            </span>
          )}
        </div>

        {!item ? (
          <button
            onClick={() => dispatch({ type: "ADD_TO_CART", payload: food })}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-gradient-to-r from-orange-200 via-orange-500 to-orange-400 text-white font-semibold transition"
          >
            <ShoppingCart size={18} /> Add to Cart
          </button>
        ) : (
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() =>
                dispatch({ type: "DECREASE_QUANTITY", payload: food._id })
              }
              className="p-2 rounded-full bg-red-100 dark:bg-red-800 text-red-600 dark:text-white hover:bg-red-200 dark:hover:bg-red-700"
            >
              <Minus size={16} />
            </button>
            <span className="text-lg font-medium text-gray-700 dark:text-white">
              {item.quantity}
            </span>
            <button
              onClick={() =>
                dispatch({ type: "INCREASE_QUANTITY", payload: food._id })
              }
              className="p-2 rounded-full bg-green-100 dark:bg-green-800 text-green-600 dark:text-white hover:bg-green-200 dark:hover:bg-green-700"
            >
              <Plus size={16} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
