import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "XLM Testnet Faucet",
  description: "Request testnet XLM with one click",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
