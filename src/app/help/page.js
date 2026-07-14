const faqs = [
  { q: "How long does delivery take?", a: "Orders are typically delivered within 4-7 business days depending on your location." },
  { q: "What payment methods do you accept?", a: "Currently we accept Cash on Delivery (COD). More options are coming soon." },
  { q: "Can I cancel my order?", a: "Yes, go to the Track Order page, look up your order by phone number, and request a cancellation before it ships." },
  { q: "Are your perfumes long-lasting?", a: "Longevity varies by fragrance and is listed on each product page — typically 6-10 hours depending on concentration (EDT/EDP/Parfum)." },
];

export default function HelpPage() {
  return (
    <div className="px-4 sm:px-6 py-12 sm:py-16 max-w-2xl mx-auto">
      <h1 className="text-2xl sm:text-3xl mb-6">Help Center</h1>
      <div className="space-y-6">
        {faqs.map((f, i) => (
          <div key={i}>
            <h3 className="text-base sm:text-lg mb-1">{f.q}</h3>
            <p className="text-sm text-[var(--color-textMuted)]">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}