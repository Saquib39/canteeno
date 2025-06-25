"use client";

import { useEffect, useState } from "react";
import TopFoodCard from "./TopFoodCard";
import { Food } from "@/context/CartContext";

export default function TopFoods() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/top-foods");
        const { success, data } = await res.json();
        if (success) setFoods(data);
      } catch (err) {
        console.error("❌ fetch top foods", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p className="py-6 text-center">Loading top foods…</p>;
  if (!foods.length) return <p className="py-6 text-center">No top foods.</p>;

  return (
    <section className="my-16 px-6 md:px-12">
      <h2 className="mb-8 text-center text-3xl font-extrabold tracking-tight bg-gradient-to-r from-orange-200 via-orange-500 to-orange-400 bg-clip-text text-transparent">
        🔥 Top Picks of the Week
      </h2>

      {/* Masonry‑style auto‑fit grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 auto-rows-fr">
        {foods.map((food) => (
          <TopFoodCard key={food._id} food={food} />
        ))}
      </div>
    </section>
  );
}
