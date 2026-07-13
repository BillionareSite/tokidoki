// ================================================
// SITE CONFIG — edit this file to rebrand the whole site
// Nothing else in the codebase should hardcode these values.
// ================================================

const config = {
  // --- Brand identity ---
  siteName: "TOKI-DOKI",
  tagline: "Japanese-Inspired Premium Perfumery",
  description:
    "TOKI-DOKI crafts premium and semi-premium fragrances inspired by Japanese aesthetics — precision, seasonality, and quiet luxury, bottled.",
  shortDescription: "Japanese-inspired perfumes, crafted with intention.",

  // --- Logo / favicon (swap these files under /public) ---
  logo: "/logo.svg",
  logoDark: "/logo-dark.svg", // used on dark sections/navbars if needed
  favicon: "/favicon.ico",

  // --- Currency / locale ---
  currency: "INR",
  currencySymbol: "₹",
  locale: "en-IN",

  // --- Contact ---
  contactEmail: "hello@tokidoki.example.com",
  supportPhone: "+91-XXXXXXXXXX",
  whatsappNumber: "91XXXXXXXXXX",

  // --- Socials ---
  social: {
    instagram: "https://instagram.com/tokidoki.perfumes",
    facebook: "",
    twitter: "",
    youtube: "",
  },

  // --- Address (for footer / invoices) ---
  address: "Rishikesh, Uttarakhand, India",

  // --- SEO defaults ---
  seo: {
    titleTemplate: "%s | TOKI-DOKI",
    defaultTitle: "TOKI-DOKI — Japanese-Inspired Premium Perfumes",
    defaultDescription:
      "Discover TOKI-DOKI's collection of Japanese-inspired premium and semi-premium perfumes. Long-lasting, thoughtfully composed fragrances.",
    ogImage: "/og-image.jpg",
  },

  // --- Feature flags (turn things on/off site-wide without deleting code) ---
  features: {
    preownedStorefront: false, // not relevant for a perfume brand, kept for parity
    codPayments: true,
    upiPayments: true,
    cardPayments: true,
    giftWrapping: true,
    sampleVials: true, // e.g. "try before you buy" mini bottles
  },

  // --- Delivery ---
  deliveryChargeDefault: 0,
  freeDeliveryMin: 999,
};

export default config;