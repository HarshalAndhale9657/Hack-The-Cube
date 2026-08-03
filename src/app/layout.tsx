import type { Metadata } from "next";
import { spaceGrotesk, inter, jetbrainsMono } from "@/lib/fonts";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SmoothScroller } from "@/components/layout/smooth-scroller";
import { siteConfig } from "@/content/site-config";
import "../tailwind.css";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  keywords: [
    "hackathon",
    "hack the cube",
    "coding competition",
    "CSI club",
    "national hackathon",
    "24-hour hackathon",
    "tech event",
  ],
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} overflow-x-clip`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-bg-surface-1 text-gray-100 antialiased overflow-x-clip">
        <SmoothScroller />
        <Navbar />
        <main style={{ paddingTop: "var(--navbar-h)" }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
