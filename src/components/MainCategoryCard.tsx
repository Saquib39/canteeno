"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export type MainCategory = {
  _id: string;
  name: string;
  slug: string;
  image: string;
};

export default function MainCategoryCard({ cat }: { cat: MainCategory }) {
  const router = useRouter();

  return (
    <motion.div
      onClick={() => router.push(`/category/${cat.slug}`)}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="group relative cursor-pointer h-full w-full"
    >
      {/* Gradient glow wrapper */}
      <span className="pointer-events-none absolute inset-0 rounded-3xl bg-[conic-gradient(var(--tw-gradient-stops))] from-orange-200 via-orange-400 to-orange-200 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Glass panel */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full rounded-3xl bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md p-6 shadow-md">
        {/* circular image */}
        <div className="relative h-28 w-28 overflow-hidden rounded-full">
          <Image
            src={cat.image}
            alt={cat.name}
            fill
            sizes="112px"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* name */}
        <h3 className="mt-4 text-center text-lg font-semibold capitalize text-black dark:text-white">
          {cat.name}
        </h3>

        {/* subtle arrow */}
        <motion.span
          className="mt-2 text-sm font-medium text-orange-500"
          animate={{ x: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          Browse →
        </motion.span>
      </div>
    </motion.div>
  );
}
