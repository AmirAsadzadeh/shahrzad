import { PageTitle, PublicShell } from "@/shared/ui/PublicShell";

export default function PrivacyPage() {
  return (
    <PublicShell>
      <section className="fit-width -mt-12 min-h-107.5 rounded-t-3xl bg-white px-5 py-6 md:px-10">
        <PageTitle title="قوانین سایت" backHref="/login-register" />
        <div className="space-y-4 text-sm leading-8 text-neutral-700">
          <p>استفاده از شهرزاد به منزله پذیرش قوانین و مقررات سامانه است.</p>
          <p>این نسخه برای چالش فنی ساخته شده و داده‌های حساس یا واقعی ذخیره نمی‌کند.</p>
        </div>
      </section>
    </PublicShell>
  );
}
