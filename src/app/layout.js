import theme from "@/lib/theme";
import config from "@/lib/config";
import "./globals.css";

export const metadata = {
  title: config.seo.defaultTitle,
  description: config.seo.defaultDescription,
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
  return vars.join("\n");
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <style>{`:root { ${themeToCssVars(theme)} }`}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}