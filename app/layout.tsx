import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VoxioDesk - AI-Powered Business Management",
  description: "Manage your business appointments and communications with AI",
  openGraph: {
    title: "VoxioDesk - AI-Powered Business Management",
    description: "Manage your business appointments and communications with AI",
    images: [
      {
        url: "/voxiodesk.png",
        width: 1200,
        height: 630,
        alt: "VoxioDesk Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VoxioDesk - AI-Powered Business Management",
    description: "Manage your business appointments and communications with AI",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
