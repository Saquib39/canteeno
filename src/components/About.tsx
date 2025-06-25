"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AboutClient() {
  return (
    <main className="px-4 py-20 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-bold text-orange-500"
        >
          Welcome to Canteeno 🍽️
        </motion.h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Discover a smarter way to enjoy fresh, hygienic and budget-friendly
          meals on campus. Canteeno is here to make your daily dining simple and
          delightful.
        </p>
      </section>

      {/* About Us Section */}
      <section className="mt-20 grid md:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="relative w-full max-w-4xl h-[300px] sm:h-[400px] md:h-[500px] mx-auto">
            <Image
              src="https://media.istockphoto.com/id/1409730623/photo/business-owner-with-his-staff-at-a-restaurant.webp?a=1&b=1&s=612x612&w=0&k=20&c=GO4MtL2638AaWW7r60TOgUcWW7DAFtR8F8VvrY8WQBY="
              alt="Our Canteen Team"
              fill
              sizes="(max-width: 640px) 100vw,
            (max-width: 1024px) 80vw,
            60vw"
              className="rounded-xl shadow-lg object-cover"
              priority
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-orange-400 mb-4">
            Who We Are
          </h2>
          <p className="text-gray-700">
            Canteeno is a modern canteen management platform designed to make
            food ordering easier for students and staff. We help eliminate long
            queues, improve food quality, and provide timely services with
            complete transparency. From fast foods to healthy meals, we make
            sure there's something for everyone.
          </p>
        </motion.div>
      </section>

      {/* Core Values Section */}
      <section className="mt-20">
        <h2 className="text-3xl font-bold text-center text-orange-400 mb-10">
          Our Core Values
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Fresh & Hygienic",
              desc: "We prioritize health and hygiene in every meal we prepare.",
              icon: "🍲",
            },
            {
              title: "Fast & Efficient",
              desc: "Your food, served quickly and with love. No long queues!",
              icon: "⚡",
            },
            {
              title: "Eco-friendly",
              desc: "We care for the environment with minimal waste and sustainable practices.",
              icon: "🌱",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-neutral-900 rounded-xl p-6 text-center shadow-md"
            >
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold text-orange-400 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-24 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-orange-500 mb-4">
            Ready to taste the difference?
          </h2>
          <p className="text-gray-600 mb-6">
            Join thousands of students using Canteeno daily for fresh and quick
            meals.
          </p>
          <Link
            href="/menu"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-medium transition"
          >
            Explore Menu
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
