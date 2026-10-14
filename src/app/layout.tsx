import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import "@ant-design/v5-patch-for-react-19";
import "./globals.css";
import { Providers } from "@/shared/ui/Providers";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-shahrzad",
  display: "swap"
});

export const metadata: Metadata = {
  title: "شهرزاد",
  description: "بازآفرینی صفحه اصلی شهرزاد"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#307fe2"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      data-scroll-behavior="smooth"
      className={`${vazirmatn.variable} ${vazirmatn.className}`}
    >
      <body className={vazirmatn.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
