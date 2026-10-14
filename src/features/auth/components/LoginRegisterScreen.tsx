"use client";

import { Button, Input, Tabs } from "antd";
import type { TabsProps } from "antd";
import { ArrowLeft, Building, Mobile, UserSquare } from "iconsax-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { requestOtp as sendOtpRequest, verifyOtp } from "@/features/auth/api/authApi";
import { useAuthStore } from "@/features/auth/store/authStore";
import { getErrorMessage } from "@/shared/api/errors";
import { safeInternalPath } from "@/shared/lib/url";
import { PublicShell } from "@/shared/ui/PublicShell";

export function LoginRegisterScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = safeInternalPath(searchParams.get("redirectTo"));
  const setUser = useAuthStore((state) => state.setUser);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [nonce, setNonce] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isValidPhone = /^09\d{9}$/.test(phone);

  const requestOtp = async () => {
    if (!isValidPhone) return;
    setLoading(true);
    setError("");
    try {
      const response = await sendOtpRequest(phone);
      setNonce(response.nonce);
      setStep("otp");
    } catch (requestError) {
      setError(getErrorMessage(requestError, "ارسال کد اعتبارسنجی انجام نشد."));
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await verifyOtp(phone, otp, nonce);
      setUser(response.user);
      router.replace(redirectTo);
    } catch (verifyError) {
      setError(getErrorMessage(verifyError, "کد وارد شده صحیح نیست."));
    } finally {
      setLoading(false);
    }
  };

  const loginTab = (
    <div className="mx-auto flex w-full max-w-[520px] flex-col gap-6 pt-4">
      {step === "phone" ? (
        <>
          <Input
            id="phone-number"
            size="large"
            prefix={<Mobile size={20} color="#7e8794" />}
            status={phone && !isValidPhone ? "error" : ""}
            placeholder="شماره موبایل را وارد کنید"
            value={phone}
            maxLength={11}
            inputMode="numeric"
            onChange={(event) => setPhone(event.target.value.replace(/\D/g, ""))}
            aria-label="شماره موبایل"
          />
          <p className="text-center text-sm font-semibold text-neutral-700">
            ورود شما به منزله پذیرش{" "}
            <Link href="/privacy" className="text-[#307fe2]">
              شرایط و قوانین
            </Link>{" "}
            است!
          </p>
          {error && <p role="alert" className="text-center text-sm text-red-600">{error}</p>}
          <Button type="primary" size="large" block disabled={!isValidPhone} loading={loading} onClick={requestOtp}>
            مرحله بعد
          </Button>
          <Button type="link" block disabled icon={<UserSquare size={18} />}>
            ورود با نام کاربری
          </Button>
        </>
      ) : (
        <>
          <p className="text-center text-sm font-medium text-neutral-700">
            یک پیامک حاوی کد اعتبارسنجی برای شماره موبایل {phone} ارسال شده است.
          </p>
          <Input.OTP length={6} value={otp} onChange={setOtp} dir="ltr" aria-label="کد اعتبارسنجی" />
          {error && <p role="alert" className="text-center text-sm text-red-600">{error}</p>}
          <Button type="primary" size="large" block disabled={otp.length < 6 || !nonce} loading={loading} onClick={verifyCode}>
            تایید
          </Button>
          <Button type="link" block onClick={() => setStep("phone")}>
            ویرایش شماره موبایل
          </Button>
        </>
      )}
    </div>
  );

  const legalSignup = (
    <div className="mx-auto flex w-full max-w-[520px] flex-col gap-6 pt-4">
      <Input size="large" prefix={<Building size={20} color="#7e8794" />} placeholder="شناسه ملی سازمان" aria-label="شناسه ملی سازمان" />
      <Input size="large" prefix={<Mobile size={20} color="#7e8794" />} placeholder="شماره موبایل نماینده" aria-label="شماره موبایل نماینده" />
      <Button type="primary" size="large" block disabled>
        شروع ثبت نام حقوقی
      </Button>
    </div>
  );

  const items: TabsProps["items"] = [
    { key: "login", label: "ورود به برنامه", children: loginTab },
    { key: "legal", label: "ثبت نام حقوقی", children: legalSignup }
  ];

  return (
    <PublicShell>
      <section className="fit-width relative -mt-12 min-h-[470px] rounded-t-3xl bg-white px-5 py-6 md:px-14">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="flex items-center gap-2 text-xl font-black">
            <ArrowLeft size={24} />
            ورود / ثبت نام
          </h1>
        </div>
        <Tabs centered defaultActiveKey="login" items={items} />
      </section>
    </PublicShell>
  );
}
