// app/(users)/category/[mainCategory]/[subCategory]/page.tsx

import type { Metadata } from "next";
import FoodCard from "@/components/FoodCard";
import type { Food } from "@/context/CartContext";

type Params = {
  mainCategory: string;
  subCategory: string;
};

type PageProps = {
  params: Promise<Params>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { mainCategory, subCategory } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/sub-category/${subCategory}`
  );

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

export default async function SubCategoryPage({ params }: PageProps) {
  const { subCategory } = await params;

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
          No food items found for this sub-category.
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
