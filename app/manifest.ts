import type { MetadataRoute } from "next";

// Web app manifest so the dashboard can be added to a phone home screen
// and opened like an app.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SWE Grind",
    short_name: "SWE Grind",
    description: "8-week software engineering learning dashboard",
    start_url: "/",
    display: "standalone",
    background_color: "#fafafa",
    // Matches the viewport themeColor in app/layout.tsx: the app chrome is
    // light even though the icon background is dark.
    theme_color: "#ffffff",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      // Full-bleed variant with the mark inside the safe zone, so Android
      // adaptive launchers don't letterbox or shrink the icon.
      {
        src: "/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
