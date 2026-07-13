import Link from "next/link";
import prisma from "@/lib/prisma";
import config from "@/lib/config";

export default async function HomePage() {
  const featured = await prisma.product.findMany({
    where: { featured: true },
    take: 8,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <section className="px-6 py-16 sm:py-24 text-center">
        <p className="text-xs sm:text-sm tracking-[0.2em] uppercase text-[var(--color-accent)] mb-4">
          {config.tagline}
        </p>
        <h1 className="text-3xl sm:text-5xl md:text-6xl max-w-3xl mx-auto leading-tight">
          Fragrance, composed with Japanese precision.
        </h1>
        <p className="mt-5 text-sm sm:text-base text-[var(--color-textMuted)] max-w-xl mx-auto">
          {config.description}
        </p>
        <Link
          href="/products"
          className="inline-block mt-8 px-8 py-3 bg-[var(--color-primary)] text-[var(--color-textInverse)] rounded-[var(--radius-pill)] text-sm tracking-wide"
        >
          Shop the Collection
        </Link>
      </section>

      <section className="px-4 sm:px-6 py-12 sm:py-16 max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl mb-8 text-center">Featured Fragrances</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featured.map((p) => (
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
          {featured.length === 0 && (
            <p className="col-span-full text-center text-[var(--color-textMuted)] py-12">
              No featured products yet — add some from the admin panel.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}