import type { Metadata } from "next";
import { APP_ROUTES } from "@/shared/constants/routes";
import { PageTitle, PublicShell } from "@/shared/ui/PublicShell";

export const metadata: Metadata = {
  title: "قوانین سایت",
  description: "قوانین و شرایط استفاده از سامانه شهرزاد.",
  openGraph: {
    title: "قوانین سایت",
    description: "قوانین و شرایط استفاده از سامانه شهرزاد."
  }
};

export default function PrivacyPage() {
  return (
    <PublicShell>
      <section className="fit-width -mt-12 min-h-107.5 rounded-t-3xl bg-white px-5 py-6 md:px-10">
        <PageTitle title="قوانین سایت" backHref={APP_ROUTES.loginRegister} />
        <div className="space-y-4 text-sm leading-8 text-neutral-700">
          <p>استفاده از شهرزاد به منزله پذیرش قوانین و مقررات سامانه است.</p>
          <p>این نسخه برای چالش فنی ساخته شده و داده‌های حساس یا واقعی ذخیره نمی‌کند.</p>
        </div>
      </section>
    </PublicShell>
  );
}
