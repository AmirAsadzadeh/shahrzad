import Image from "next/image";
import Link from "next/link";
import { ArrowLeft2 } from "iconsax-react";
import { APP_ROUTES } from "@/shared/constants/routes";

const footerLinks = [
  { href: APP_ROUTES.aboutShahrzad, label: "درباره شهرزاد" },
  { href: APP_ROUTES.privacy, label: "قوانین سایت" },
  { href: "https://shahrzadcity.ir/contact", label: "تماس با ما" },
  { href: APP_ROUTES.faq, label: "پرسش های متداول" },
  { href: "https://shahrzadcity.ir/download-app", label: "اپلیکیشن موبایل" }
];

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-white">
      <header className="shahrzad-pattern relative h-34 rounded-b-[18px] px-6 text-white">
        <nav className="fit-width flex h-16 items-center justify-between gap-6 text-sm font-bold">
          <Link href={APP_ROUTES.loginRegister} aria-label="صفحه ورود">
            <span className="relative block h-8.5 w-23">
              <Image src="/assets/logo.svg" fill sizes="92px" alt="شهرزاد" />
            </span>
          </Link>
          <div className="flex items-center gap-10 text-white">
            <Link className="text-white!" href={APP_ROUTES.faq}>
              سوالات متداول
            </Link>
            <Link className="text-white!" href={APP_ROUTES.aboutShahrzad}>
              درباره شهرزاد
            </Link>
          </div>
        </nav>
      </header>
      {children}
      <footer className="mt-auto bg-shahrzad-footer px-6 py-8 text-white">
        <div className="fit-width flex flex-col items-center justify-between gap-6 md:flex-row">
          <span className="relative hidden h-24 w-47.5 md:block">
            <Image src="/assets/footer-picture.svg" fill sizes="190px" alt="" />
          </span>
          <nav className="flex flex-wrap justify-center gap-x-10 gap-y-4 text-sm font-medium">
            {footerLinks.map((item) => (
              <Link key={item.label} href={item.href} className="text-white!">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </main>
  );
}

export function PageTitle({ title, backHref = APP_ROUTES.home }: { title: string; backHref?: string }) {
  return (
    <div className="mb-6 flex items-center justify-between rounded-2xl bg-white p-4 tile-shadow">
      <h1 className="text-base font-bold text-neutral-900">{title}</h1>
      <Link className="flex items-center gap-2 text-sm font-semibold text-shahrzad-primary" href={backHref}>
        بازگشت
        <ArrowLeft2 size={18} />
      </Link>
    </div>
  );
}
