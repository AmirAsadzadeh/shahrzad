import type { Metadata } from "next";
import { ServicesScreen } from "@/features/home/components/ServicesScreen";

export const metadata: Metadata = {
  title: "همه خدمات",
  description: "فهرست خدمات شهری در دسترس در سامانه شهرزاد.",
  robots: {
    index: false,
    follow: false
  }
};

export default function ServicesPage() {
  return <ServicesScreen />;
}
