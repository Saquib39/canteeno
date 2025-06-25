"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Food {
  _id: string;
  name: string;
  price: number;
  offerPrice?: number;
  image: string;
  description?: string;
}

export default function ProductList() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/order/admin/foods");
        const { data } = await res.json();
        setFoods(data);
      } catch (err) {
        console.error("❌ Error fetching foods", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">📋 All Food Items</h1>

      {loading ? (
        <p className="text-center py-10">Loading...</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {foods.map((food) => (
            <div
              key={food._id}
              className="relative border rounded-lg shadow-md p-4 hover:shadow-xl transition-all bg-white dark:bg-neutral-900"
            >
              {/* IMAGE */}
              <div className="relative h-40 w-full mb-3 rounded-md overflow-hidden">
                <Image
                  src={food.image}
                  alt={food.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* TEXT */}
              <h2 className="text-lg font-semibold mb-1 capitalize">
                {food.name}
              </h2>
              <p className="text-green-600 font-bold mb-1">
                ₹{food.offerPrice ?? food.price}
                {food.offerPrice && (
                  <span className="ml-2 text-sm text-gray-500 line-through">
                    ₹{food.price}
                  </span>
                )}
              </p>
              {food.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {food.description}
                </p>
              )}

              {/* ✅ Delete Button */}
              <button
                disabled={loading || !isAdmin}
                onClick={async () => {
                  const confirm = window.confirm(`Delete "${food.name}"?`);
                  if (!confirm) return;

                  try {
                    const res = await fetch(
                      `/api/order/admin/foods/${food._id}`,
                      {
                        method: "DELETE",
                      }
                    );
                    const data = await res.json();
                    if (data.success) {
                      setFoods((prev) =>
                        prev.filter((f) => f._id !== food._id)
                      );
                      toast.success("✅ Food deleted!");
                    } else {
                      toast.error("❌ Failed to delete food.");
                    }
                  } catch (err) {
                    toast.error("❌ Server error. Try again.");
                    console.error(err);
                  }
                }}
                className="absolute bottom-2 right-2 text-red-500 hover:text-red-700 text-sm font-semibold"
              >
                🗑 Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
