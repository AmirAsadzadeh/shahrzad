import { APP_ROUTES } from "@/shared/constants/routes";
import { PageTitle, PublicShell } from "@/shared/ui/PublicShell";

export default function FaqPage() {
  return (
    <PublicShell>
      <section className="fit-width -mt-12 min-h-107.5 rounded-t-3xl bg-white px-5 py-6 md:px-10">
        <PageTitle title="سوالات متداول" backHref={APP_ROUTES.loginRegister} />
        <div className="space-y-4 text-sm leading-8 text-neutral-700">
          <p>چطور وارد شهرزاد شوم؟ با شماره موبایل و کد اعتبارسنجی mock وارد شوید.</p>
          <p>کدام خدمات در صفحه اصلی وجود دارد؟ کیف پول، حمل و نقل، شهرپی، تاکسی، نقشه و خدمات شهری.</p>
        </div>
      </section>
    </PublicShell>
  );
}
