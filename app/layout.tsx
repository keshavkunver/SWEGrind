import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "SWE Grind",
  description: "8-week software engineering learning dashboard",
  appleWebApp: { capable: true, title: "SWE Grind", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover", // lets the bottom tab bar pad for the iOS home bar
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#161618" },
  ],
};

// Applies a stored theme choice before first paint so a forced light/dark
// never flashes the other theme. No stored choice = follow the system.
const themeInit = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.classList.add(t)}catch(e){}`;

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body className="bg-zinc-50 text-zinc-900 antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-zinc-900 focus:px-3 focus:py-1.5 focus:text-white"
        >
          Skip to content
        </a>
        <div className="flex min-h-screen flex-col md:flex-row">
          <Sidebar email={user?.email} />
          <main
            id="main"
            className="min-w-0 max-w-6xl flex-1 p-4 pb-24 md:p-8 md:pb-8"
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
