"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

export default function AddMainCategoryPage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !image) {
      toast.error("Please provide both name and image.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", image);

      const uploadRes = await fetch("/api/upload-main-category", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Image upload failed");

      const { url: imageUrl } = await uploadRes.json();

      const saveRes = await fetch("/api/main-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image: imageUrl }),
      });

      if (!saveRes.ok) throw new Error("Failed to save category");

      toast.success("✅ Main Category added successfully!");
      setName("");
      setImage(null);
      (document.getElementById("imageInput") as HTMLInputElement).value = "";
    } catch (err) {
      console.error("❌ Error:", err);
      toast.error("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow bg-white dark:bg-neutral-900">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        Add Main Category
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={name}
          placeholder="Category Name"
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded text-black dark:text-white dark:bg-neutral-800"
        />

        <input
          type="file"
          id="imageInput"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) setImage(e.target.files[0]);
          }}
          required
          className="w-full text-black dark:text-white"
        />

        <button
          type="submit"
          disabled={loading || !isAdmin}
          className="w-full px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Adding..." : isAdmin ? "Add Category" : "Demo Mode"}
        </button>
      </form>
    </div>
  );
}
