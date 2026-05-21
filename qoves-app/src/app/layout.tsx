import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Qoves – Personalised Facial Analysis",
  description:
    "Understand your facial features and start your glow-up today with a proven action plan, no plastic surgery needed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
