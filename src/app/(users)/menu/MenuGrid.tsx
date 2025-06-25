"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface SubCat {
  _id: string;
  name: string;
  slug: string;
  mainCategorySlug: string;
  image: string;
}

export default function MenuGrid({ subs }: { subs: SubCat[] }) {
  return (
    <motion.div
      layout
      className="grid auto-rows-fr gap-8 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
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
            <span
              className="pointer-events-none absolute inset-px rounded-[inherit]
                         bg-[conic-gradient(var(--tw-gradient-stops))]
                         from-fuchsia-500 via-rose-500 to-orange-400 opacity-0
                         transition-opacity duration-300 group-hover:opacity-100"
            />
            <div className="relative z-10 flex flex-1 flex-col items-center justify-center">
              {/* image */}
              <div className="relative h-32 w-32 overflow-hidden rounded-full">
                <Image
                  src={sub.image}
                  alt={sub.name}
                  fill
                  sizes="128px"
                  className="object-cover transition-transform duration-500
                             group-hover:scale-110"
                  priority={i < 4}                
                />
              </div>
              <h2 className="mt-4 text-center text-lg font-semibold capitalize">
                {sub.name}
              </h2>
            </div>
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
  );
}
