import DisplaySubCategory from "@/components/DisplaySubCategory";

export async function generateMetadata({
  params,
}: {
  params: { mainCategory: string };
}) {
  const { mainCategory } = await Promise.resolve(params); // ✅ Suppresses warning
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

export default async function MainCategoryPage(props: {
  params: { mainCategory: string };
}) {
  const { mainCategory } = await Promise.resolve(props.params); // ✅ fixes same issue here too

  return (
    <section className="p-4">
      <h1 className="text-2xl pt-10 font-bold mb-2 capitalize text-center text-orange-400">
        Subcategories for {mainCategory.replace(/-/g, " ")}
      </h1>
      <DisplaySubCategory mainCategory={mainCategory} />
    </section>
  );
}
