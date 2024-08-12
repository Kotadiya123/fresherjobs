import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Free Online Calculators",
  description: "Online calculator for quick calculations, along with a large collection of calculators on math, finance, fitness, and more, each with in-depth information.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      <title>
		Calculator.net: Free Online Calculators - Math, Fitness, Finance, Science
	</title>
	<meta name="description"
		content="Online calculator for quick calculations, along with a large collection of calculators on math, finance, fitness, and more, each with in-depth information." />
	<link rel="stylesheet" href="style.css" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
