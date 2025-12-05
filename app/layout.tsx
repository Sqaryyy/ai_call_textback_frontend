import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VoxioDesk - AI-Powered Business Management",
  description: "Manage your business appointments and communications with AI",
  openGraph: {
    title: "VoxioDesk - AI-Powered Business Management",
    description: "Manage your business appointments and communications with AI",
    images: [
      {
        url: "https://voxiodesk.com/voxiodesk.png",
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
    images: ["https://voxiodesk.com/voxiodesk.png"],
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
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
