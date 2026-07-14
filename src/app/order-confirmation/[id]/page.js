import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function OrderConfirmationPage({ params }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) return notFound();

  return (
    <div className="px-4 sm:px-6 py-12 sm:py-16 max-w-lg mx-auto text-center">
      <div className="text-5xl mb-4">✓</div>
      <h1 className="text-2xl sm:text-3xl mb-2">Order Placed!</h1>
      <p className="text-[var(--color-textMuted)] mb-6">
        Order <span className="text-[var(--color-text)]">#{order.orderId}</span> — Cash on Delivery
      </p>

      <div className="text-left bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5 mb-6">
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm mb-2">
            <span>{item.name} × {item.qty}</span>
            <span>₹{item.price * item.qty}</span>
          </div>
        ))}
        <div className="border-t border-[var(--color-divider)] mt-3 pt-3 flex justify-between text-base">
          <span>Total</span>
          <span>₹{order.total}</span>
        </div>
      </div>

      <p className="text-sm text-[var(--color-textMuted)] mb-6">
        Delivering to: {order.address}, {order.pincode}
      </p>

      <Link href="/products" className="inline-block px-8 py-3 bg-[var(--color-primary)] text-[var(--color-textInverse)] rounded-[var(--radius-pill)] text-sm">
        Continue Shopping
      </Link>
    </div>
  );
}