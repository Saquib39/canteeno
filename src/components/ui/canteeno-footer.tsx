/* app/components/CanteenoFooter.tsx
   -- Dark/Light–ready, animated, responsive footer  */

"use client";

import { motion, Variants } from "framer-motion";
import {
  IconAdjustmentsCheck,
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandX,
  IconHome,
  IconMenu2,
  IconPhone,
} from "@tabler/icons-react";
import Link from "next/link";

// ---------- animation helpers ----------
const stagger: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.55, ease: "easeOut" },
  }),
};

// ---------- data ----------
const links = [
  { title: "Home", href: "/", icon: IconHome },
  { title: "Menu", href: "/menu", icon: IconMenu2 },
  { title: "Contact", href: "/contact", icon: IconPhone },
  { title: "About", href: "/about", icon: IconAdjustmentsCheck },
] as const;

const socials = [
  { title: "Instagram", href: "https://www.instagram.com/saquib8446/", icon: IconBrandInstagram },
  { title: "X / Twitter", href: "https://twitter.com", icon: IconBrandX },
  { title: "GitHub", href: "https://github.com/Saquib39", icon: IconBrandGithub },
] as const;

// ---------- component ----------
export default function CanteenoFooter() {
  return (
    <footer className="relative isolate w-full overflow-hidden border-t border-zinc-200/70 bg-zinc-50 pt-16 text-zinc-700 dark:border-zinc-700/40 dark:bg-zinc-950 dark:text-zinc-300">
      {/* background blobs */}
      <BackgroundBlobs />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-12 px-6">
        {/* brand */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-orange-400 via-pink-500 to-fuchsia-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent"
        >
          Canteeno
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-lg text-base leading-relaxed text-zinc-600 dark:text-zinc-400"
        >
          Fresh flavours, fast service — your daily dose of campus energy.
        </motion.p>

        {/* nav links */}
        <nav className="grid gap-x-8 gap-y-6 sm:grid-cols-2 md:grid-cols-4">
          {links.map((l, i) => (
            <motion.div key={l.title} variants={stagger} initial="hidden" whileInView="show" custom={i} viewport={{ once: true }}>
              <Link
                href={l.href}
                className="group flex items-center gap-3 text-sm font-medium transition-colors hover:text-orange-400"
              >
                <span className="grid place-items-center rounded-full bg-zinc-800/5 p-2 text-zinc-500 shadow-sm backdrop-blur-lg transition-transform group-hover:scale-110 dark:bg-zinc-300/10 dark:text-zinc-300">
                  <l.icon size={18} strokeWidth={1.8} />
                </span>
                {l.title}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* social icons */}
        <motion.ul
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          viewport={{ once: true }}
          className="flex gap-4"
        >
          {socials.map((s) => (
            <li key={s.title}>
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.title}
                className="grid h-10 w-10 place-items-center rounded-full bg-zinc-800/5 shadow-inner backdrop-blur-md transition hover:bg-orange-400 hover:text-white dark:bg-zinc-300/10 dark:hover:bg-orange-500"
              >
                <s.icon size={20} strokeWidth={1.6} />
              </a>
            </li>
          ))}
        </motion.ul>

        {/* copyright */}
        <p className="pb-12 text-sm text-zinc-500 dark:text-zinc-500">
          © {new Date().getFullYear()} Canteeno. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

// ---------- background blobs ----------
function BackgroundBlobs() {
  const blobs = [
    "top-[-8rem] left-[-6rem]",
    "bottom-[-6rem] right-[-4rem]",
    "bottom-[-10rem] left-[30%]",
    "top-1/3 right-[25%]",
  ];
  const palette = [
    "from-orange-400 via-orange-500 to-pink-500",
    "from-fuchsia-500 via-pink-500 to-orange-400",
  ];

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {blobs.map((pos, i) => (
        <motion.div
          key={pos}
          className={`absolute ${pos} h-72 w-72 rounded-full bg-gradient-to-br ${palette[i % palette.length]} mix-blend-multiply blur-3xl dark:mix-blend-screen`}
          initial={{ opacity: 0.25, scale: 0.85 }}
          animate={{ opacity: 0.55, scale: 1.15 }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
