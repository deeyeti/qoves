import type { Metadata } from "next";
import Image from "next/image";
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
      <body>
        <div className="stickyLogo">
          <Image
            src="/assets/qoves logo.png"
            alt="Qoves Logo"
            width={32}
            height={32}
            className="logoImage"
            priority
          />
        </div>
        {children}
      </body>
    </html>
  );
}
