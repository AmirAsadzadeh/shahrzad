import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginRegisterScreen } from "@/features/auth/components/LoginRegisterScreen";

export const metadata: Metadata = {
  title: "ورود / ثبت نام | شهرزاد"
};

export default function LoginRegisterPage() {
  return (
    <Suspense fallback={null}>
      <LoginRegisterScreen />
    </Suspense>
  );
}
