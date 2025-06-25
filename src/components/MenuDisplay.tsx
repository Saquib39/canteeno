"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface SubCat {
  _id: string;
  name: string;
  slug: string;
  mainCategorySlug: string;
  image: string;
}

export default function MenuDisplay() {
  const [subs, setSubs] = useState<SubCat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/subcat");
        const { data } = await res.json();
        setSubs(data);
      } catch (err) {
        console.error("❌ fetch sub‑cats", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      {/* HEADING WITH GRADIENT TEXT */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10 text-center text-4xl font-extrabold tracking-tight
                   bg-gradient-to-r from-200-500 via-orange-500 to-orange-200
                   bg-clip-text text-transparent"
      >
        Explore Our Menu
      </motion.h1>

      {loading ? (
        <p className="py-10 text-center">Loading sub‑categories…</p>
      ) : (
        <motion.div
          layout
          className="grid auto-rows-fr gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {subs.map((sub, i) => (
            <motion.div
              key={sub._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`/category/${sub.mainCategorySlug}/${sub.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl
                           bg-white/70 p-5 shadow-md ring-1 ring-black/5 backdrop-blur-md
                           transition-all duration-300 hover:shadow-2xl dark:bg-neutral-900/60
                           dark:ring-white/10"
              >
                {/* glow border on hover */}
                <span className="pointer-events-none absolute inset-px rounded-[inherit]
                                 bg-[conic-gradient(var(--tw-gradient-stops))]
                                 from-fuchsia-500 via-rose-500 to-orange-400 opacity-0
                                 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative z-10 flex flex-1 flex-col items-center justify-center">
                  {/* IMAGE with zoom */}
                  <div className="relative h-32 w-32 overflow-hidden rounded-full">
                    <Image
                      src={sub.image}
                      alt={sub.name}
                      fill
                      sizes="128px"
                      priority={i === 0}
                      className="object-cover transition-transform duration-500
                                 group-hover:scale-110"
                    />
                  </div>

                  {/* NAME */}
                  <h2 className="mt-4 text-center text-lg font-semibold capitalize text-black
                                 dark:text-white">
                    {sub.name}
                  </h2>
                </div>

                {/* subtle arrow hint */}
                <div className="mt-6 flex items-center justify-center">
                  <motion.span
                    className="text-sm font-medium text-orange-400"
                    animate={{ x: [0, 6, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    Browse&nbsp;→
                  </motion.span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </main>
  );
}
