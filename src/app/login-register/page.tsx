import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginRegisterScreen } from "@/features/auth/components/LoginRegisterScreen";

export const metadata: Metadata = {
  title: "ورود / ثبت نام",
  description: "ورود یا ثبت نام در سامانه شهرزاد با شماره موبایل.",
  robots: {
    index: false,
    follow: false
  }
};

export default function LoginRegisterPage() {
  return (
    <Suspense fallback={null}>
      <LoginRegisterScreen />
    </Suspense>
  );
}
