"use client"

import React from "react"
import Link from "next/link"
import ColourfulText from "@/components/ui/colourful-text"

export default function Header() {
  return (
    <header className="relative h-[80vh] mx-10 overflow-hidden">
      {/* Background Image Layer */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/images/hero.jpg')`, // Make sure this exists in public/images
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 " />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col justify-end h-full p-6 sm:p-10">
        <h1 className="text-4xl md:text-5xl text-white font-extrabold mb-4 drop-shadow-lg">
          Welcome to <ColourfulText  text="CANTEENO" /> 
        </h1>

        <div className="flex flex-wrap gap-4">
          <Link href="/menu">
            <button className="px-6 py-2 bg-orange-400 hover:bg-green-700 text-white rounded-lg shadow-md transition">
              View Menu
            </button>
          </Link>

          <Link href="/login">
            <button className="px-6 py-2 bg-white hover:bg-gray-200 text-gray-800 rounded-lg shadow-md transition">
              Login
            </button>
          </Link>
        </div>
      </div>
    </header>
  )
}
