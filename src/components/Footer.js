import Link from "next/link";
import config from "@/lib/config";

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--color-primary)",
        color: "var(--color-textInverse)",
        marginTop: "80px",
      }}
    >
      <div
        style={{
          maxWidth: "1240px",
          margin: "0 auto",
          padding: "56px 24px 32px",
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
          gap: "32px",
        }}
        className="tk-footer-grid"
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "24px",
              letterSpacing: "0.08em",
              marginBottom: "12px",
            }}
          >
            {config.siteName}
          </div>
          <p style={{ fontSize: "14px", opacity: 0.75, lineHeight: 1.6, maxWidth: "280px" }}>
            {config.shortDescription}
          </p>
        </div>

        <div>
          <h4 style={footerHeading}>Shop</h4>
          <FooterLink href="/products">All Perfumes</FooterLink>
          <FooterLink href="/products?category=Woody">Woody</FooterLink>
          <FooterLink href="/products?category=Floral">Floral</FooterLink>
          <FooterLink href="/products?category=Oud">Oud</FooterLink>
        </div>

        <div>
          <h4 style={footerHeading}>Support</h4>
          <FooterLink href="/contact">Contact Us</FooterLink>
          <FooterLink href="/help">Help Center</FooterLink>
          <FooterLink href="/orders">Track Order</FooterLink>
          <FooterLink href="/about">About Us</FooterLink>
        </div>

        <div>
          <h4 style={footerHeading}>Connect</h4>
          {config.social.instagram && (
            <FooterLink href={config.social.instagram}>Instagram</FooterLink>
          )}
          <p style={{ fontSize: "14px", opacity: 0.75, marginTop: "12px" }}>
            {config.contactEmail}
          </p>
          <p style={{ fontSize: "14px", opacity: 0.75 }}>{config.supportPhone}</p>
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid rgba(247,243,236,0.15)",
          padding: "18px 24px",
          textAlign: "center",
          fontSize: "13px",
          opacity: 0.6,
        }}
      >
        © {new Date().getFullYear()} {config.siteName}. All rights reserved.
      </div>

      <style>{`
        @media (max-width: 760px) {
          .tk-footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

function FooterLink({ href, children }) {
  return (
    <Link
      href={href}
      style={{
        display: "block",
        fontSize: "14px",
        opacity: 0.75,
        color: "inherit",
        textDecoration: "none",
        marginBottom: "10px",
      }}
    >
      {children}
    </Link>
  );
}

const footerHeading = {
  fontFamily: "var(--font-body)",
  fontSize: "13px",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  opacity: 0.6,
  marginBottom: "16px",
  fontWeight: 600,
};