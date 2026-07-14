import prisma from "@/lib/prisma";
import AddToCartButton from "@/components/AddToCartButton";
import ProductGallery from "@/components/ProductGallery";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return notFound();

  return (
    <div className="px-4 sm:px-6 py-8 sm:py-12 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
  <ProductGallery images={product.images} name={product.name} />

      <div>
        <p className="text-xs uppercase tracking-widest text-[var(--color-accent)] mb-2">
          {product.category} · {product.concentration}
        </p>
        <h1 className="text-2xl sm:text-3xl mb-3">{product.name}</h1>
        <p className="text-xl sm:text-2xl text-[var(--color-accent)] mb-4">
          ₹{product.price}
          {product.originalPrice > product.price && (
            <span className="ml-2 text-sm line-through text-[var(--color-textMuted)]">
              ₹{product.originalPrice}
            </span>
          )}
        </p>
        <p className="text-sm sm:text-base text-[var(--color-textMuted)] leading-relaxed mb-6">
          {product.description}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div>
            <p className="text-[var(--color-textMuted)]">Size</p>
            <p>{product.sizeMl}ml</p>
          </div>
          <div>
            <p className="text-[var(--color-textMuted)]">Gender</p>
            <p className="capitalize">{product.gender}</p>
          </div>
          {product.longevity && (
            <div>
              <p className="text-[var(--color-textMuted)]">Longevity</p>
              <p>{product.longevity}</p>
            </div>
          )}
          {product.sillage && (
            <div>
              <p className="text-[var(--color-textMuted)]">Sillage</p>
              <p>{product.sillage}</p>
            </div>
          )}
        </div>

        {(product.topNotes?.length > 0 || product.middleNotes?.length > 0 || product.baseNotes?.length > 0) && (
          <div className="mb-6 space-y-2 text-sm">
            {product.topNotes?.length > 0 && (
              <p><span className="text-[var(--color-textMuted)]">Top notes:</span> {product.topNotes.join(", ")}</p>
            )}
            {product.middleNotes?.length > 0 && (
              <p><span className="text-[var(--color-textMuted)]">Heart notes:</span> {product.middleNotes.join(", ")}</p>
            )}
            {product.baseNotes?.length > 0 && (
              <p><span className="text-[var(--color-textMuted)]">Base notes:</span> {product.baseNotes.join(", ")}</p>
            )}
          </div>
        )}

        <AddToCartButton product={product} />
      </div>
    </div>
  );
}