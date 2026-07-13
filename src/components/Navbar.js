"use client";

import { useState } from "react";
import Link from "next/link";
import config from "@/lib/config";

const collections = [
  { name: "Woody", href: "/products?category=Woody" },
  { name: "Floral", href: "/products?category=Floral" },
  { name: "Citrus", href: "/products?category=Citrus" },
  { name: "Oud", href: "/products?category=Oud" },
  { name: "Musk", href: "/products?category=Musk" },
];

export default function Navbar() {
  const [shopOpen, setShopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      style={{
        background: "var(--color-surface)",
        borderBottom: "1px solid var(--color-border)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: "1240px",
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "76px",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "26px",
            letterSpacing: "0.08em",
            color: "var(--color-primary)",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          {config.siteName}
        </Link>

        {/* Desktop nav */}
        <nav
          className="tk-desktop-nav"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "36px",
          }}
        >
          <Link href="/" style={navLinkStyle}>
            Home
          </Link>

          <div
            onMouseEnter={() => setShopOpen(true)}
            onMouseLeave={() => setShopOpen(false)}
            style={{ position: "relative" }}
          >
            <Link href="/products" style={navLinkStyle}>
              Shop
            </Link>
            {shopOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "28px",
                  left: "-16px",
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                  boxShadow: "var(--shadow-lg)",
                  minWidth: "180px",
                  padding: "8px 0",
                }}
              >
                {collections.map((c) => (
                  <Link
                    key={c.name}
                    href={c.href}
                    style={{
                      display: "block",
                      padding: "10px 20px",
                      fontSize: "14px",
                      color: "var(--color-text)",
                      textDecoration: "none",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/about" style={navLinkStyle}>
            About
          </Link>
          <Link href="/contact" style={navLinkStyle}>
            Contact
          </Link>
        </nav>

        {/* Right icons */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Link href="/profile" aria-label="Account" style={iconStyle}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" />
            </svg>
          </Link>
          <Link href="/cart" aria-label="Cart" style={iconStyle}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 6h2l2.4 12.2a2 2 0 0 0 2 1.8h8.6a2 2 0 0 0 2-1.6L22 8H6" />
              <circle cx="9" cy="21" r="1" />
              <circle cx="18" cy="21" r="1" />
            </svg>
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="tk-mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
            style={{
              display: "none",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--color-primary)",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile nav panel */}
      {mobileOpen && (
        <div
          className="tk-mobile-panel"
          style={{
            display: "none",
            flexDirection: "column",
            padding: "16px 24px 24px",
            borderTop: "1px solid var(--color-border)",
            background: "var(--color-surface)",
          }}
        >
          <Link href="/" style={mobileLinkStyle} onClick={() => setMobileOpen(false)}>
            Home
          </Link>
          <Link href="/products" style={mobileLinkStyle} onClick={() => setMobileOpen(false)}>
            Shop
          </Link>
          {collections.map((c) => (
            <Link
              key={c.name}
              href={c.href}
              style={{ ...mobileLinkStyle, paddingLeft: "16px", fontSize: "14px", opacity: 0.8 }}
              onClick={() => setMobileOpen(false)}
            >
              {c.name}
            </Link>
          ))}
          <Link href="/about" style={mobileLinkStyle} onClick={() => setMobileOpen(false)}>
            About
          </Link>
          <Link href="/contact" style={mobileLinkStyle} onClick={() => setMobileOpen(false)}>
            Contact
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 860px) {
          .tk-desktop-nav { display: none !important; }
          .tk-mobile-toggle { display: block !important; }
          .tk-mobile-panel { display: flex !important; }
        }
      `}</style>
    </header>
  );
}

const navLinkStyle = {
  fontFamily: "var(--font-body)",
  fontSize: "15px",
  color: "var(--color-text)",
  textDecoration: "none",
  letterSpacing: "0.02em",
};

const mobileLinkStyle = {
  ...navLinkStyle,
  padding: "12px 0",
  borderBottom: "1px solid var(--color-divider)",
};

const iconStyle = {
  color: "var(--color-primary)",
  display: "flex",
  alignItems: "center",
};  