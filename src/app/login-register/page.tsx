import { Suspense } from "react";
import { LoginRegisterScreen } from "@/features/auth/components/LoginRegisterScreen";

export default function LoginRegisterPage() {
  return (
    <Suspense fallback={null}>
      <LoginRegisterScreen />
    </Suspense>
  );
}
