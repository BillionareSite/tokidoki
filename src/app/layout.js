import theme from "@/lib/theme";
import config from "@/lib/config";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata = {
  title: {
    template: config.seo.titleTemplate,
    default: config.seo.defaultTitle,
  },
  description: config.seo.defaultDescription,
  icons: {
    icon: config.favicon,
  },
};

function themeToCssVars(theme) {
  const vars = [];
  Object.entries(theme.colors).forEach(([key, val]) => {
    vars.push(`--color-${key}: ${val};`);
  });
  Object.entries(theme.fonts).forEach(([key, val]) => {
    vars.push(`--font-${key}: ${val};`);
  });
  Object.entries(theme.radius).forEach(([key, val]) => {
    vars.push(`--radius-${key}: ${val};`);
  });
  Object.entries(theme.shadow).forEach(([key, val]) => {
    vars.push(`--shadow-${key}: ${val};`);
  });
  return vars.join("\n");
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@400;500;600&family=Noto+Serif+JP:wght@400;600&family=Noto+Sans+JP:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{ __html: `:root { ${themeToCssVars(theme)} }` }} />
      </head>
      <body>
        <Navbar />
        <main style={{ minHeight: "60vh" }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}