import FoodCard from "@/components/FoodCard";
import type { Food } from "@/context/CartContext";

export async function generateMetadata({
  params,
}: {
  params: { mainCategory: string; subCategory: string };
}) {
  /* ✅ await params once */
  const { mainCategory, subCategory } = await Promise.resolve(params);

  // Fetch backend data for better SEO
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/subcat/${subCategory}`
  );

  /* ───────── fallback ──────── */
  if (!res.ok) {
    const fallbackTitle = `${subCategory.replace(/-/g, " ")} | Canteeno Menu`;
    return {
      title: fallbackTitle,
      description: "Explore sub-category meals from Canteeno.",
      alternates: {
        canonical: `/category/${mainCategory}/${subCategory}`,
      },
      openGraph: {
        title: fallbackTitle,
        description: "Explore sub-category meals from Canteeno.",
        images: ["/og/subcategory-default.png"],
      },
    };
  }

  /* ───────── success ──────── */
  const { name, description, image } = await res.json();

  return {
    title: `${name} | Canteeno Menu`,
    description,
    alternates: {
      canonical: `/category/${mainCategory}/${subCategory}`,
    },
    openGraph: {
      title: `${name} | Canteeno Menu`,
      description,
      images: [image || "/og/subcategory-default.png"],
    },
  };
}

// ✅ Actual Page Component
export default async function SubCategoryPage(props: {
  params: { mainCategory: string; subCategory: string };
}) {
  const { subCategory } = await Promise.resolve(props.params);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/food?subSlug=${subCategory}`,
    { cache: "no-store" }
  );
  const data = await res.json();
  const foods: Food[] = data.success ? data.data : [];

  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold capitalize mb-6 text-center text-orange-400">
        {subCategory.replace(/-/g, " ")}
      </h1>

      {!foods.length ? (
        <p className="text-center text-gray-600">
          No food items found for this sub‑category.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {foods.map((food) => (
            <FoodCard key={food._id} food={food} />
          ))}
        </div>
      )}
    </section>
  );
}
