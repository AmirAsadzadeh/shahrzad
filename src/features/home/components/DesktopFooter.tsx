import Image from "next/image";
import Link from "next/link";
import { APP_ROUTES } from "@/shared/constants/routes";

type Props = {
  isVisible: boolean;
};

export function DesktopFooter({ isVisible }: Props) {
  return (
    <footer
      aria-hidden={!isVisible}
      className={`shahrzad-desktop-footer pointer-events-none fixed inset-x-0 bottom-0 z-1000 hidden h-69.5 overflow-hidden md:block ${
        isVisible ? "pointer-events-auto opacity-100" : "opacity-0"
      }`}
      style={{ transform: `translateY(${isVisible ? 0 : 300}px)` }}
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-28.25 flex h-41.25 items-end justify-center overflow-y-visible">
        <Image
          src="/assets/footer-picture.svg"
          width={609}
          height={165}
          sizes="609px"
          alt=""
          className="block h-41.25 w-152.25 object-contain"
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-shahrzad-primary px-28 py-4 text-white">
        <nav className="mx-auto flex h-20.25 max-w-264 items-center justify-center text-sm font-normal">
          <Link href={APP_ROUTES.aboutShahrzad} className="px-6 text-white!">
            درباره شهرزاد
          </Link>
          <Link href={APP_ROUTES.privacy} className="px-6 text-white!">
            قوانین سایت
          </Link>
          <Link href="https://shahrzadcity.ir/contact" className="px-6 text-white!">
            تماس با ما
          </Link>
          <Link href={APP_ROUTES.faq} className="px-6 text-white!">
            پرسش های متداول
          </Link>
          <Link href="https://shahrzadcity.ir/download-app" className="px-6 text-white!">
            اپلیکیشن موبایل
          </Link>
        </nav>
      </div>
    </footer>
  );
}
