import type { Metadata } from "next";
import { HomeScreen } from "@/features/home/components/HomeScreen";

export const metadata: Metadata = {
  title: "خدمات شهری",
  description: "دسترسی یکپارچه به خدمات شهری، حمل و نقل و پرداخت‌های شهرزاد.",
  robots: {
    index: false,
    follow: false
  }
};

export default function HomePage() {
  return <HomeScreen />;
}
