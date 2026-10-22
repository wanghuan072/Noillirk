import type { Metadata } from "next";
import { isLocalPreview, site } from "@/lib/site";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(site.origin),
  applicationName: site.name,
  robots: isLocalPreview ? { index: false, follow: false } : undefined,
  icons: {
    icon: [{ url: "/images/icon.png", type: "image/png", sizes: "512x512" }],
    apple: [
      {
        url: "/images/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
