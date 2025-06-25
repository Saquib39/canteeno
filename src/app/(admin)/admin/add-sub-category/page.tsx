"use client";

import { useEffect, useState } from "react";
// import { toast } from "react-toastify";
import { toast, ToastContainer } from "react-toastify";

import { useSession } from "next-auth/react";
import "react-toastify/dist/ReactToastify.css";

/* ---------- Types ---------- */
type MainCat = { _id: string; name: string };

export default function AddSubCategoryPage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [mainCat, setMainCat] = useState<string>("");
  const [mainCats, setMainCats] = useState<MainCat[]>([]);
  const [loading, setLoading] = useState(false);

  /* Fetch main categories for dropdown */
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/main-category");
      const data = await res.json();
      if (data.success) setMainCats(data.data);
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAdmin) {
      toast.info("Demo mode: only admins can add items");
      return;
    }

    if (!name.trim() || !image || !mainCat) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      /* 1️⃣ Upload image */
      const fd = new FormData();
      fd.append("file", image);
      const up = await fetch("/api/upload-sub-category", {
        method: "POST",
        body: fd,
      });
      if (!up.ok) throw new Error("Upload failed");
      const { url } = await up.json();

      /* 2️⃣ Save sub-category */
      const save = await fetch("/api/sub-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image: url, mainCategoryId: mainCat }),
      });

      if (save.status === 409) {
        toast.warning("Sub-category already exists in that main category");
      } else if (!save.ok) {
        throw new Error("Save failed");
      } else {
        toast.success("✅ Sub-category added!");
        setName("");
        setImage(null);
        setMainCat("");
        (document.getElementById("imageInput") as HTMLInputElement).value = "";
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow bg-white dark:bg-neutral-900">
      <h2 className="text-2xl font-bold mb-4 text-center">Add Sub Category</h2>

      {!isAdmin && (
        <p className="mb-4 text-sm text-orange-600 text-center">
          Demo mode: actions disabled for non-admin users
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Sub-Category Name"
          required
          className="w-full px-4 py-2 border rounded text-black dark:text-white dark:bg-neutral-800"
        />

        <select
          value={mainCat}
          onChange={(e) => setMainCat(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded bg-transparent text-black dark:text-white dark:bg-neutral-800"
        >
          <option value="">Select Main Category</option>
          {mainCats.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          id="imageInput"
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] ?? null)}
          required
          className="w-full text-black dark:text-white"
        />

        <button
          type="submit"
          disabled={loading || !isAdmin}
          className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Adding…" : isAdmin ? "Add Sub Category" : "Demo Mode"}
        </button>
      </form>

      <ToastContainer position="top-center" />
    </div>
  );
}
