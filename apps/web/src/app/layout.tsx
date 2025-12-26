import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Hank's Garage",
  description: "Games, trucks, and awesome stuff!",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="adventure">
      <body className={`${nunito.className} antialiased min-h-screen bg-base-100`}>
        {children}
      </body>
    </html>
  );
}
