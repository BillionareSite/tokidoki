import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams;
  const category = params?.category;
  const gender = params?.gender;

  const where = {};
  if (category) where.category = category;
  if (gender) where.gender = gender;

  const products = await prisma.product.findMany({ where, orderBy: { createdAt: "desc" } });
  const categories = ["Woody", "Floral", "Citrus", "Oud", "Musk"];

  return (
    <div className="px-4 sm:px-6 py-8 sm:py-12 max-w-6xl mx-auto">
      <h1 className="text-2xl sm:text-3xl mb-2">All Perfumes</h1>
      <p className="text-sm text-[var(--color-textMuted)] mb-6">
        {products.length} fragrance{products.length !== 1 ? "s" : ""}
      </p>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
        <Link
          href="/products"
          className={`shrink-0 px-4 py-2 rounded-[var(--radius-pill)] text-xs sm:text-sm border ${
            !category
              ? "bg-[var(--color-primary)] text-[var(--color-textInverse)]"
              : "border-[var(--color-border)] text-[var(--color-text)]"
          }`}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c}
            href={`/products?category=${c}`}
            className={`shrink-0 px-4 py-2 rounded-[var(--radius-pill)] text-xs sm:text-sm border ${
              category === c
                ? "bg-[var(--color-primary)] text-[var(--color-textInverse)]"
                : "border-[var(--color-border)] text-[var(--color-text)]"
            }`}
          >
            {c}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((p) => (
          <Link key={p.id} href={`/products/${p.id}`} className="group block">
            <div className="aspect-square bg-[var(--color-surfaceMuted)] rounded-[var(--radius-md)] overflow-hidden mb-3">
              {p.images?.[0] && (
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
            </div>
            <h3 className="text-sm sm:text-base text-[var(--color-text)]">{p.name}</h3>
            <p className="text-xs sm:text-sm text-[var(--color-textMuted)]">
              {p.sizeMl}ml · {p.concentration}
            </p>
            <p className="text-sm sm:text-base text-[var(--color-accent)] mt-1">₹{p.price}</p>
          </Link>
        ))}
        {products.length === 0 && (
          <p className="col-span-full text-center text-[var(--color-textMuted)] py-12">
            No products found in this category yet.
          </p>
        )}
      </div>
    </div>
  );
}