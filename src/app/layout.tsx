import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aetherforge.studio"),
  title: "AetherForge | Automotive Concept Studio",
  description:
    "AetherForge creates cinematic automotive concepts, hypercar visual studies, 3D showroom experiences, and AI-assisted design packages.",
  openGraph: {
    title: "AetherForge | Automotive Concept Studio",
    description:
      "Cinematic hypercar concepts, immersive showroom experiences, and premium automotive design packages.",
    images: ["/work/aether-veloce.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
