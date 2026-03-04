import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Free Invoice Generator — Create & Download PDF Invoices | QuickInvoice",
  description:
    "Create professional invoices in seconds. No sign-up required, no watermarks, completely free. Fill in your details, preview, and download as PDF instantly.",
  keywords: [
    "free invoice generator",
    "invoice maker",
    "create invoice online",
    "invoice template",
    "PDF invoice",
    "invoice generator no sign up",
    "free invoice maker",
    "online invoice creator",
    "simple invoice generator",
    "invoice PDF download",
  ],
  openGraph: {
    title: "Free Invoice Generator — QuickInvoice",
    description:
      "Create professional invoices in seconds. No sign-up, no watermarks, 100% free.",
    type: "website",
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
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
