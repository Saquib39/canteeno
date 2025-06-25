"use client";

import { useEffect, useState, useRef } from "react";
import MainCategoryCard, { MainCategory } from "./MainCategoryCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function DisplayMainCategory() {
  const [cats, setCats] = useState<MainCategory[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/main-category");
        const { data } = await res.json();
        setCats(data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    })();
  }, []);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === "left" ? -400 : 400,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative px-4 md:px-8">
      <h2 className="text-3xl font-bold text-center my-8 text-orange-400 dark:text-orange-400">
        Browse Categories
      </h2>

      {/* Scroll buttons */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center h-10 w-10 rounded-full bg-white/80 hover:bg-white shadow"
      >
        <ChevronLeft className="text-black" />
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center h-10 w-10 rounded-full bg-white/80 hover:bg-white shadow"
      >
        <ChevronRight className="text-black" />
      </button>

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto overflow-y-hidden scrollbar-hide py-4 no-wrap"
        style={{ scrollBehavior: "smooth", whiteSpace: "nowrap" }}
      >
        {cats.map((cat) => (
          <motion.div
            key={cat._id}
            className="inline-block min-w-[200px]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <MainCategoryCard cat={cat} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
