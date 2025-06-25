"use client";
import React from "react";
import ColourfulText from "@/components/ui/colourful-text";
export default function ColourfulTextDemo() {
  return (
    <div className="w-full flex items-center justify-center py-10">
      <h1 className="text-3xl pt-15 md:text-5xl font-bold text-center text-black dark:text-white">
        What They Say About Our <ColourfulText text="CANTEENO" /> 
      </h1>
    </div>
  );
}
