"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { User, Mail, PackageSearch, Wallet } from "lucide-react";

export default function AccountPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <main className="max-w-xl mx-auto p-6">
        <p className="text-center text-gray-500 animate-pulse">Loading account...</p>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <motion.h1
        className="text-3xl font-bold text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        My Account
      </motion.h1>

      {session?.user ? (
        <motion.div
          className="space-y-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.15 } },
          }}
        >
          {/* User Info Cards */}
          <motion.div
            className="bg-white/60 dark:bg-black/40 border border-gray-300 dark:border-white/10 backdrop-blur-md rounded-xl p-5 shadow-md flex items-center gap-4"
            whileHover={{ scale: 1.02 }}
          >
            <User className="text-green-500" />
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="text-lg font-semibold">{session.user.name}</p>
            </div>
          </motion.div>

          <motion.div
            className="bg-white/60 dark:bg-black/40 border border-gray-300 dark:border-white/10 backdrop-blur-md rounded-xl p-5 shadow-md flex items-center gap-4"
            whileHover={{ scale: 1.02 }}
          >
            <Mail className="text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-lg font-semibold">{session.user.email}</p>
            </div>
          </motion.div>

          {/* Action Links */}
          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <Link
              href="/my-orders"
              className="group flex items-center gap-3 p-4 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-xl shadow-md transition transform hover:scale-105"
            >
              <PackageSearch className="group-hover:rotate-6 transition" />
              <span className="font-semibold">View My Orders</span>
            </Link>

            <Link
              href="/account/pay-later"
              className="group flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-xl shadow-md transition transform hover:scale-105"
            >
              <Wallet className="group-hover:-rotate-6 transition" />
              <span className="font-semibold">Pay Pending Orders</span>
            </Link>
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="text-center py-10 px-4 bg-white/50 dark:bg-black/30 backdrop-blur-lg border border-dashed border-gray-300 dark:border-white/10 rounded-xl shadow-inner"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            You're not logged in
          </p>
          <Link
            href="/login"
            className="inline-block mt-2 px-5 py-2 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition"
          >
            Login to access your account
          </Link>
        </motion.div>
      )}
    </main>
  );
}
