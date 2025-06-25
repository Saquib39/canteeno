"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface Props {
  subCategory: {
    _id: string;
    name: string;
    slug: string;
    image: string;
    mainCategory: string | { slug: string };
  };
  index?: number;
}

export default function SubCategoryCard({ subCategory, index = 0 }: Props) {
  const mainSlug =
    typeof subCategory.mainCategory === "object"
      ? subCategory.mainCategory.slug
      : subCategory.mainCategory;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        href={`/category/${mainSlug}/${subCategory.slug}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-3xl
                   bg-white/70 p-5 shadow-md ring-1 ring-black/5 backdrop-blur-md
                   transition-all duration-300 hover:shadow-2xl dark:bg-neutral-900/60
                   dark:ring-white/10"
      >
        {/* Glow border effect */}
        <span className="pointer-events-none absolute inset-px rounded-[inherit]
                         bg-[conic-gradient(var(--tw-gradient-stops))]
                         from-fuchsia-500 via-rose-500 to-orange-400 opacity-0
                         transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center">
          {/* Image with hover zoom */}
          <div className="relative h-32 w-32 overflow-hidden rounded-full">
            <Image
              src={subCategory.image}
              alt={subCategory.name}
              
              fill
              sizes="128px"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>

          {/* Sub-category name */}
          <h3 className="mt-4 text-center text-lg font-semibold capitalize text-black dark:text-white">
            {subCategory.name}
          </h3>
        </div>

        {/* Arrow hint */}
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
  );
}
