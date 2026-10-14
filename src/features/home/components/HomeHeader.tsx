"use client";

import { Dropdown, Spin } from "antd";
import type { MenuProps } from "antd";
import { ArrowLeft2, Logout, Notification, ProfileCircle, Setting2 } from "iconsax-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout as logoutRequest } from "@/features/auth/public";
import { useAuthStore } from "@/features/auth/public";
import { ScanBarcodeIcon } from "@/shared/ui/ScanBarcodeIcon";

type Props = {
  isCompact: boolean;
  loading?: boolean;
};

export function HomeHeader({ isCompact, loading = false }: Props) {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const items: MenuProps["items"] = [
    {
      key: "profile",
      label: "حساب کاربری",
      icon: <ProfileCircle size={18} />,
      disabled: true
    },
    {
      key: "setting",
      label: "تنظیمات",
      icon: <Setting2 size={18} />,
      disabled: true
    },
    {
      type: "divider"
    },
    {
      key: "logout",
      label: "خروج",
      icon: <Logout size={18} />
    }
  ];

  const handleMenuClick: MenuProps["onClick"] = async ({ key }) => {
    if (key === "logout") {
      try {
        await logoutRequest();
      } finally {
        logout();
      }
      router.replace("/login-register?redirectTo=/home");
    }
  };

  return (
    <header
      className={`shahrzad-header-pattern relative z-10 h-[200px] shrink-0 overflow-visible px-0 text-white md:sticky md:top-0 md:h-[188px] md:overflow-hidden md:rounded-b-2xl md:px-6 ${
        isCompact ? "md:z-30 md:h-[200px]" : "md:z-10"
      }`}
    >
      <div className="fit-width relative z-30 h-full">
        <nav className="hidden h-[96px] items-center justify-between gap-6 text-base font-bold md:flex">
          <div className="flex items-center gap-12">
            <Link href="/home" aria-label="صفحه اصلی شهرزاد">
              <span className="relative block h-11 w-[118px]">
                <Image src="/assets/logo.svg" fill sizes="118px" alt="شهرزاد" />
              </span>
            </Link>
            <div className="flex items-center gap-12">
              <Link className="!text-white" href="/services">
                خدمات شهرزاد
              </Link>
              <Link className="!text-white" href="/faq">
                سوالات متداول
              </Link>
              <Link className="!text-white" href="/about-shahrzad">
                درباره شهرزاد
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Dropdown menu={{ items, onClick: handleMenuClick }} trigger={["click"]}>
              <button type="button" className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/25 bg-white/12 text-white backdrop-blur transition hover:bg-white/20" aria-label="باز کردن منوی حساب کاربری">
                <ProfileCircle size={24} color="#fff" variant="Bold" />
              </button>
            </Dropdown>
            {loading ? (
              <div className="flex h-12 items-center gap-6 rounded-xl border border-white/20 bg-white/10 px-4 text-base font-extrabold text-white backdrop-blur">
                <span>کیف پول:</span>
                <Spin size="small" />
              </div>
            ) : (
              <Link
                href="/wallet"
                className="flex h-14 items-center gap-3 rounded-2xl border border-white/25 bg-white/12 px-5 text-base font-extrabold !text-white backdrop-blur transition hover:bg-white/20"
              >
                <span>کیف پول:</span>
                <span>مشاهده</span>
                <ArrowLeft2 size={18} />
              </Link>
            )}
          </div>
        </nav>

        <div className="relative h-[84px] md:hidden">
          <Dropdown menu={{ items, onClick: handleMenuClick }} trigger={["click"]}>
            <button type="button" className="absolute right-5 top-7 z-10 flex h-6 w-6 items-center justify-center text-white" aria-label="حساب کاربری">
              <ProfileCircle size={24} color="#fff" />
            </button>
          </Dropdown>
          <Link
            href="/home"
            aria-label="صفحه اصلی شهرزاد"
            aria-hidden={isCompact}
            tabIndex={isCompact ? -1 : 0}
            className={`pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 shahrzad-header-transition ${isCompact ? "h-4 w-12 scale-75 opacity-0" : "pointer-events-auto h-8 w-24 scale-100 opacity-100"}`}
          >
            <Image
              src="https://web.shahrzadcity.ir/assets/logo-DMHUAEBR.svg"
              fill
              sizes="96px"
              alt="شهرزاد"
              className="object-contain"
            />
          </Link>
          <button
            type="button"
            disabled
            aria-hidden={isCompact}
            tabIndex={isCompact ? -1 : 0}
            className={`absolute left-5 top-7 z-10 flex h-6 w-6 items-center justify-center text-white shahrzad-header-transition ${isCompact ? "pointer-events-none -translate-y-1 opacity-0" : "opacity-100"}`}
            aria-label="اسکن"
          >
            <ScanBarcodeIcon size={24} color="#fff" />
          </button>
          <button
            type="button"
            disabled
            className={`absolute top-7 z-10 flex h-6 w-6 items-center justify-center text-white shahrzad-header-transition ${isCompact ? "left-5" : "left-[60px]"}`}
            aria-label="اعلان ها"
          >
            <Notification size={24} color="#fff" />
          </button>
          {loading ? (
            <div
              className={`shahrzad-wallet-surface shahrzad-header-transition absolute z-0 flex items-center justify-between border border-white/20 px-3 text-sm font-normal leading-[22px] text-white ${
                isCompact
                  ? "left-1/2 top-[14px] h-12 w-[calc(100%-104px)] -translate-x-1/2"
                  : "inset-x-5 top-[84px] h-12"
              }`}
            >
              <div className="text-xs font-normal leading-[18.86px]">
                <span>کیف پول</span>
              </div>
              <Spin size="small" />
            </div>
          ) : (
            <Link
              href="/wallet"
              className={`shahrzad-wallet-surface shahrzad-header-transition absolute z-0 flex items-center justify-between border border-white/20 px-3 text-sm font-normal leading-[22px] !text-white ${
                isCompact
                  ? "left-1/2 top-[14px] h-12 w-[calc(100%-104px)] -translate-x-1/2"
                  : "inset-x-5 top-[84px] h-12"
              }`}
            >
              <div className="text-xs font-normal leading-[18.86px]">
                <span>کیف پول</span>
              </div>
              <div className="flex flex-1 items-center justify-end text-xs font-normal leading-[18.86px]">
                <span className="flex items-center justify-end text-xs font-bold leading-[18.86px]">
                  مشاهده موجودی
                  <ArrowLeft2 size={20} color="#fff" />
                </span>
              </div>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
