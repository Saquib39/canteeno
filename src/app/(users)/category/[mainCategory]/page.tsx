// app/(users)/category/[mainCategory]/page.tsx

import type { Metadata } from "next";
import DisplaySubCategory from "@/components/DisplaySubCategory";

type Params = { mainCategory: string };

type PageProps = {
  params: Promise<Params>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { mainCategory } = await params;
  const name = mainCategory.replace(/-/g, " ");
  const title = `${name} | Canteeno Categories`;
  const description = `Explore all food options under ${name} at Canteeno. Find delicious meals and combos.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/category/${mainCategory}`,
    },
    openGraph: {
      title,
      description,
      images: ["/og/category-default.png"],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { mainCategory } = await params;

  return (
    <section className="p-4">
      <h1 className="text-2xl pt-10 font-bold mb-2 capitalize text-center text-orange-400">
        Subcategories for {mainCategory.replace(/-/g, " ")}
      </h1>
      <DisplaySubCategory mainCategory={mainCategory} />
    </section>
  );
}
