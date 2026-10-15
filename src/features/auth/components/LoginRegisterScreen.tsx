"use client";

import { Button, Input, Tabs } from "antd";
import type { TabsProps } from "antd";
import { Building, Mobile, UserSquare } from "iconsax-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSWRConfig } from "swr";
import { useState } from "react";
import type { SessionResponse } from "@/entities/auth/model/types";
import { NestedPageLayout } from "@/features/appShell/public";
import { requestOtp as sendOtpRequest, verifyOtp } from "@/features/auth/api/authApi";
import { AUTH_SESSION_KEY } from "@/features/auth/model/session";
import { getErrorMessage } from "@/shared/api/errors";
import { APP_ROUTES } from "@/shared/constants/routes";
import { toAsciiDigits, toPersianDigits } from "@/shared/lib/digits";
import { safeInternalPath } from "@/shared/lib/url";

export function LoginRegisterScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = safeInternalPath(searchParams.get("redirectTo"));
  const { mutate } = useSWRConfig();
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

  const verifyCode = async (code: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await verifyOtp(phone, code, nonce);
      await mutate<SessionResponse>(
        AUTH_SESSION_KEY,
        { authenticated: true, user: response.user },
        { revalidate: false }
      );
      router.replace(redirectTo);
    } catch (verifyError) {
      setError(getErrorMessage(verifyError, "کد وارد شده صحیح نیست."));
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (code: string) => {
    const normalizedCode = toAsciiDigits(code).replace(/\D/g, "").slice(0, 6);
    setOtp(normalizedCode);

    if (normalizedCode.length === 6 && nonce && !loading) {
      void verifyCode(normalizedCode);
    }
  };

  const loginTab = (
    <div className="mx-auto flex w-full max-w-130 flex-col gap-6 pt-4">
      {step === "phone" ? (
        <form
          className="flex flex-col gap-6"
          onSubmit={(event) => {
            event.preventDefault();
            void requestOtp();
          }}
        >
          <Input
            id="phone-number"
            size="large"
            prefix={<Mobile size={20} color="#7e8794" />}
            status={phone && !isValidPhone ? "error" : ""}
            placeholder="شماره موبایل را وارد کنید"
            value={toPersianDigits(phone)}
            maxLength={11}
            inputMode="numeric"
            dir="ltr"
            onChange={(event) => {
              const normalizedPhone = toAsciiDigits(event.target.value).replace(/\D/g, "");
              setPhone(normalizedPhone);
            }}
            aria-label="شماره موبایل"
            className="shahrzad-phone-input"
          />
          <p className="text-center text-sm font-semibold text-neutral-700">
            ورود شما به منزله پذیرش{" "}
            <Link href={APP_ROUTES.privacy} className="text-shahrzad-primary">
              شرایط و قوانین
            </Link>{" "}
            است!
          </p>
          {error && <p role="alert" className="text-center text-sm text-red-600">{error}</p>}
          <Button
            type="primary"
            size="large"
            block
            disabled={!isValidPhone}
            loading={loading}
            htmlType="submit"
            className="h-auto! py-2.5!"
          >
            مرحله بعد
          </Button>
          <Button
            type="link"
            block
            disabled
            icon={<UserSquare size={18} />}
            className="h-auto! py-2.5!"
          >
            ورود با نام کاربری
          </Button>
        </form>
      ) : (
        <>
          <p className="text-center text-sm font-medium text-neutral-700">
            یک پیامک حاوی کد اعتبارسنجی برای شماره موبایل {toPersianDigits(phone)} ارسال شده است.
          </p>
          <Input.OTP
            autoFocus
            length={6}
            value={toPersianDigits(otp)}
            onChange={handleOtpChange}
            dir="ltr"
            aria-label="کد اعتبارسنجی"
            className="shahrzad-otp-input justify-center"
          />
          {error && <p role="alert" className="text-center text-sm text-red-600">{error}</p>}
          <Button
            type="primary"
            size="large"
            block
            disabled={otp.length < 6 || !nonce}
            loading={loading}
            onClick={() => void verifyCode(otp)}
            className="h-auto! py-2.5!"
          >
            تایید
          </Button>
          <Button
            type="link"
            block
            onClick={() => setStep("phone")}
            className="h-auto! py-2.5!"
          >
            ویرایش شماره موبایل
          </Button>
        </>
      )}
    </div>
  );

  const legalSignup = (
    <div className="mx-auto flex w-full max-w-130 flex-col gap-6 pt-4">
      <Input size="large" prefix={<Building size={20} color="#7e8794" />} placeholder="شناسه ملی سازمان" aria-label="شناسه ملی سازمان" />
      <Input size="large" prefix={<Mobile size={20} color="#7e8794" />} placeholder="شماره موبایل نماینده" aria-label="شماره موبایل نماینده" />
      <Button type="primary" size="large" block disabled className="h-auto! py-2.5!">
        شروع ثبت نام حقوقی
      </Button>
    </div>
  );

  const items: TabsProps["items"] = [
    { key: "login", label: "ورود به برنامه", children: loginTab },
    { key: "legal", label: "ثبت نام حقوقی", children: legalSignup }
  ];

  return (
    <NestedPageLayout
      backHref={APP_ROUTES.home}
      contentAriaLabel="محتوای ورود و ثبت نام"
      showAccount={false}
      showWallet={false}
      title="ورود / ثبت نام"
    >
      <div className="mx-auto w-full max-w-120 pt-2">
        <Tabs centered defaultActiveKey="login" items={items} />
      </div>
    </NestedPageLayout>
  );
}
