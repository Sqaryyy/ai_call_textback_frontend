import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VoxioDesk - Turn missed calls into booked appointments, effortlessly",
  description:
    "Never miss another customer. VoxioDesk automatically texts back missed callers, answers their questions, and books appointments directly into your calendar. No receptionist needed.",
  keywords: [
    "missed calls",
    "appointment booking",
    "AI receptionist",
    "business automation",
    "lead capture",
    "SMS automation",
    "calendar booking",
  ],
  authors: [{ name: "VoxioDesk" }],
  openGraph: {
    title: "VoxioDesk - Turn missed calls into booked appointments",
    description:
      "Automatically text back missed callers and book appointments 24/7. No manual follow-up needed.",
    url: "https://voxiodesk.com",
    siteName: "VoxioDesk",
    images: [
      {
        url: "/og-image.png", // You'll need to create this image
        width: 1200,
        height: 630,
        alt: "VoxioDesk - Automated appointment booking",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VoxioDesk - Turn missed calls into booked appointments",
    description:
      "Automatically text back missed callers and book appointments 24/7. No manual follow-up needed.",
    images: ["/VOXIO_DESK.png"], // Same image as OpenGraph
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
