import type { Metadata } from "next";
import "./globals.css";
import { Inter, Concert_One } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const concert = Concert_One({ weight: "400", subsets: ["latin"], variable: "--font-concert" });

export const metadata: Metadata = {
  title: "Fraggle Rock Posters ? A Playful Tribute",
  description: "Graphically stunning, interactive SVG posters inspired by Fraggle Rock.",
  metadataBase: new URL("https://agentic-b2fbeacf.vercel.app"),
  openGraph: {
    title: "Fraggle Rock Posters",
    description: "Interactive SVG posters inspired by Fraggle Rock.",
    url: "https://agentic-b2fbeacf.vercel.app",
    siteName: "Fraggle Rock Posters",
    images: [
      { url: "/og-default.png", width: 1200, height: 630, alt: "Fraggle Rock Posters" },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${concert.variable}`}>
      <body className={inter.className}>
        <div className="fixed inset-0 -z-10">
          <div className="gradient-orb" />
        </div>
        {children}
      </body>
    </html>
  );
}
