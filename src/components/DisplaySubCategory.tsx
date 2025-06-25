"use client";

import { useEffect, useState } from "react";
import SubCategoryCard from "./SubCategoryCard";


//Sub-category type

type SubCat = {
  _id: string;
  name: string;
  slug: string;
  image: string;
  mainCategory: string | { slug: string };
};

export default function DisplaySubCategory({ mainCategory }: { mainCategory: string }) {
  const [subs, setSubs] = useState<SubCat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/sub-category");
        const data = await res.json();
        if (data.success) {
          setSubs(data.data);
        }
      } catch (err) {
        console.error("Error fetching subcategories:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = subs.filter((s) =>
    typeof s.mainCategory === "object"
      ? s.mainCategory.slug === mainCategory
      : s.mainCategory === mainCategory
  );

  if (loading) return <p className="py-4 text-center">Loading subcategories…</p>;

  if (!filtered.length)
    return (
      <p className="py-4 text-center text-gray-600">
        No sub‑category added for <strong>{mainCategory.replace(/-/g, " ")}</strong>.
      </p>
    );

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="grid gap-8 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

        {filtered.map((sub, i) => (
          <SubCategoryCard key={sub._id} subCategory={sub} index={i} />
        ))}
      </div>
    </main>
  );
}
