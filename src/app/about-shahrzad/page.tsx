import { PageTitle, PublicShell } from "@/shared/ui/PublicShell";

export default function AboutPage() {
  return (
    <PublicShell>
      <section className="fit-width -mt-12 min-h-107.5 rounded-t-3xl bg-white px-5 py-6 md:px-10">
        <PageTitle title="درباره شهرزاد" backHref="/login-register" />
        <p className="text-sm leading-8 text-neutral-700">
          شهرزاد درگاه یکپارچه خدمات شهری تهران است؛ تجربه‌ای برای پرداخت، حمل و نقل، پشتیبانی و دسترسی سریع به
          سرویس‌های روزمره شهروندان.
        </p>
      </section>
    </PublicShell>
  );
}
