import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Calendar Cleanup | Organize Your Google Calendar Effortlessly",
  description:
    "Clean up and organize your Google Calendar with our powerful tool. Remove unwanted events, declutter your schedule, and save time with automated calendar management.",
  keywords: [
    "Google Calendar cleanup",
    "organize calendar",
    "delete calendar events",
    "calendar management",
    "declutter Google Calendar",
  ],
  authors: [{ name: "Calendar Cleanup Team" }],
  creator: "Calendar Cleanup",
  publisher: "Calendar Cleanup",
  metadataBase: new URL("https://calendar-cleanup.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Calendar Cleanup | Organize Your Google Calendar Effortlessly",
    description:
      "Clean up and organize your Google Calendar with our powerful tool. Remove unwanted events, declutter your schedule, and save time.",
    url: "https://calendar-cleanup.com",
    siteName: "Calendar Cleanup",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Calendar Cleanup | Organize Your Google Calendar Effortlessly",
    description:
      "Clean up and organize your Google Calendar with our powerful tool. Remove unwanted events, declutter your schedule, and save time.",
    creator: "@calendarcleanup",
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
