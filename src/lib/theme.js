// ================================================
// THEME CONFIG — edit this file to restyle the whole site
// These get injected as CSS variables in layout.js (see globals.css)
// Do NOT hardcode hex colors anywhere else in the app — always
// reference the CSS variables (var(--color-accent) etc.)
// ================================================

const theme = {
  name: "sumi-sakura", // current theme preset name, useful if you build a theme switcher later

  colors: {
    // Core palette — inspired by sumi-e ink, washi paper, and sakura
    background: "#F7F3EC", // washi paper off-white
    backgroundAlt: "#FFFFFF",
    surface: "#FFFFFF",
    surfaceMuted: "#EFE8DC",

    text: "#1C1B19", // sumi ink black
    textMuted: "#5A554C",
    textInverse: "#F7F3EC",

    primary: "#1C1B19", // ink black — used for nav, buttons, headings
    primaryHover: "#000000",

    accent: "#C9A05C", // muted kintsugi gold — CTAs, highlights, prices
    accentHover: "#B48A45",

    secondary: "#E8B4B8", // soft sakura pink — used sparingly for seasonal accents
    secondaryHover: "#DFA0A5",

    success: "#4C7A5D", // matcha green
    error: "#B33A3A", // hanko red
    warning: "#C9A05C",

    border: "#DDD5C7",
    divider: "#E5DECF",
  },

  fonts: {
    heading: "'Cormorant Garamond', 'Noto Serif JP', serif", // elegant serif for a premium feel
    body: "'Inter', 'Noto Sans JP', sans-serif",
    accent: "'Cormorant Garamond', serif", // for prices / emphasis
  },

  radius: {
    sm: "4px",
    md: "8px",
    lg: "16px",
    pill: "999px",
  },

  shadow: {
    sm: "0 1px 2px rgba(28,27,25,0.06)",
    md: "0 4px 12px rgba(28,27,25,0.08)",
    lg: "0 12px 32px rgba(28,27,25,0.12)",
  },
};

export default theme;