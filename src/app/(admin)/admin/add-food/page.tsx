"use client";

import { useEffect, useState } from "react";

/* ---------- Type definitions ---------- */
type MainCat = { _id: string; name: string };
type SubCat = {
  _id: string;
  name: string;
  mainCategory: string | { _id: string; name: string };
};
import { useSession } from "next-auth/react";


export default function AddFoodPage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";
  const [mainCats, setMainCats] = useState<MainCat[]>([]);
  const [subCats, setSubCats] = useState<SubCat[]>([]);
  const [mainId, setMainId] = useState("");
  const [subId, setSubId] = useState("");

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [offerPrice, setOfferPrice] = useState<number | "">("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      const mc = await fetch("/api/main-category").then((r) => r.json());
      const sc = await fetch("/api/sub-category").then((r) => r.json());
      if (mc.success) setMainCats(mc.data);
      if (sc.success) setSubCats(sc.data);
    };
    fetchAll();
  }, []);

  const filteredSubs = subCats.filter((s) => {
    if (typeof s.mainCategory === "object") {
      return s.mainCategory._id === mainId;
    }
    return s.mainCategory === mainId;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !image || !desc.trim() || !price || !mainId || !subId) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", image);
      const up = await fetch("/api/upload-sub-category", { method: "POST", body: fd });
      if (!up.ok) throw new Error("Upload failed");
      const { url } = await up.json();

      const res = await fetch("/api/food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          image: url,
          description: desc,
          price: Number(price),
          offerPrice: offerPrice ? Number(offerPrice) : undefined,
          mainCategoryId: mainId,
          subCategoryId: subId,
        }),
      });

      if (res.status === 409) {
        alert("⚠️ Food with same name already exists in this sub-category");
      } else if (!res.ok) {
        throw new Error("Save failed");
      } else {
        alert("✅Food added!");
        setName("");
        setDesc("");
        setPrice("");
        setOfferPrice("");
        setImage(null);
        setMainId("");
        setSubId("");
        (document.getElementById("imageInput") as HTMLInputElement).value = "";
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error adding food");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 border border-gray-300 dark:border-neutral-700 rounded-lg shadow bg-white dark:bg-neutral-900 text-black dark:text-white">
      <h2 className="text-2xl font-bold mb-4 text-center">🍽 Add Food Item</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* name */}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Food Name"
          required
          className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded bg-white dark:bg-neutral-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        {/* description */}
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Description"
          required
          className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded bg-white dark:bg-neutral-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        {/* price / offerPrice */}
        <div className="flex gap-4">
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="Price ₹"
            required
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded bg-white dark:bg-neutral-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="number"
            value={offerPrice}
            onChange={(e) => setOfferPrice(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="Offer Price ₹"
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded bg-white dark:bg-neutral-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* main category */}
        <select
          value={mainId}
          onChange={(e) => {
            setMainId(e.target.value);
            setSubId("");
          }}
          required
          className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded bg-white dark:bg-neutral-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">Select Main Category</option>
          {mainCats.map((mc) => (
            <option key={mc._id} value={mc._id}>
              {mc.name}
            </option>
          ))}
        </select>

        {/* sub category */}
        <select
          value={subId}
          onChange={(e) => setSubId(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded bg-white dark:bg-neutral-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">Select Sub Category</option>
          {filteredSubs.map((sc) => (
            <option key={sc._id} value={sc._id}>
              {sc.name}
            </option>
          ))}
        </select>

        {/* image */}
        <input
          id="imageInput"
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] ?? null)}
          required
          className="w-full text-sm text-gray-700 dark:text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
        />

        {/* submit */}
        <button
          type="submit"
          disabled={loading || !isAdmin}
          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold transition"
        >
          {loading ? "Adding…" : "Add Food"}
        </button>
      </form>
    </div>
  );
}
