import MenuGrid from "./MenuGrid";           // ← client sub‑component

// 🔑 SEO metadata
export const metadata = {
  title: "Menu | Canteeno",
  description:
    "Browse every food category served at Canteeno — fresh, tasty and student‑friendly.",
  openGraph: {
    title: "Menu | Canteeno",
    description:
      "Browse every food category served at Canteeno — fresh, tasty and student‑friendly.",
    images: ["/og/menu.png"],
  },
};

// 🔄 Revalidate every 10 min (ISR) — adjust as you like
export const revalidate = 600;

export default async function MenuPage() {
  // Server‑side fetch → HTML already contains sub‑category list
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/subcat`,
    { next: { revalidate } }        // cache‑aware
  );
  const { data: subs = [] } = await res.json();

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1
        className="mb-10 text-center text-4xl font-extrabold tracking-tight
                   bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-300
                   bg-clip-text text-transparent"
      >
        Explore Our Menu
      </h1>

      {subs.length ? (
        <MenuGrid subs={subs} />
      ) : (
        <p className="py-10 text-center text-gray-600">
          No sub‑categories found.
        </p>
      )}
    </main>
  );
}
