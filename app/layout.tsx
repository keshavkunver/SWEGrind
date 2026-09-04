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
  themeColor: "#ffffff",
};

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
