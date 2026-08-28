import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Avengers: Training Protocol",
  description: "A GBA-inspired Avengers 2D simulation.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
