"use client";

import { App as AntApp, Dropdown } from "antd";
import type { MenuProps } from "antd";
import {
  ArrowDown2,
  Logout,
  Notification,
  ProfileCircle,
  Setting2
} from "iconsax-react";
import Image from "next/image";
import Link from "next/link";
import { useLogout } from "@/features/auth/public";
import { WalletAction } from "@/features/appShell/components/WalletAction";
import { getErrorMessage } from "@/shared/api/errors";
import { ScanBarcodeIcon } from "@/shared/ui/ScanBarcodeIcon";

type Props = {
  isCompact: boolean;
  isWalletLoading?: boolean;
  showAccount?: boolean;
  showWallet?: boolean;
};

export function AppHeader({
  isCompact,
  isWalletLoading = false,
  showAccount = true,
  showWallet = true
}: Props) {
  const { message } = AntApp.useApp();
  const { isLoggingOut, logout } = useLogout();

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
      label: isLoggingOut ? "در حال خروج..." : "خروج",
      icon: <Logout size={18} />,
      disabled: isLoggingOut
    }
  ];

  const handleMenuClick: MenuProps["onClick"] = async ({ key }) => {
    if (key !== "logout") return;

    try {
      await logout();
    } catch (error) {
      void message.error(getErrorMessage(error, "خروج از حساب انجام نشد. لطفا دوباره تلاش کنید."));
    }
  };

  return (
    <header
      className={`shahrzad-header-pattern shahrzad-header-transition relative z-10 shrink-0 overflow-visible px-0 text-white md:static md:h-34 md:overflow-visible md:rounded-b-2xl md:px-6 ${
        isCompact ? "h-31.5" : "h-50"
      }`}
    >
      <div className="relative z-30 mx-auto h-full w-full max-w-300 md:h-18.5">
        <nav className="hidden h-17.5 items-center justify-between gap-6 text-sm font-bold md:flex">
          <div className="flex items-center gap-12">
            <Link href="/home" aria-label="صفحه اصلی شهرزاد">
              <span className="relative block h-14 w-24">
                <Image src="/assets/logo.svg" fill sizes="96px" alt="شهرزاد" />
              </span>
            </Link>
            <div className="flex items-center gap-8">
              <Link className="flex items-center gap-2 text-white" href="/services">
                خدمات شهرزاد
                <ArrowDown2 size={16} />
              </Link>
              <Link className="text-white" href="/faq">
                سوالات متداول
              </Link>
              <Link className="text-white" href="/about-shahrzad">
                درباره شهرزاد
              </Link>
            </div>
          </div>

          <div className="flex flex-row-reverse items-center gap-5.5">
            {showAccount && (
              <Dropdown
                disabled={isLoggingOut}
                menu={{ items, onClick: handleMenuClick }}
                trigger={["click"]}
              >
                <button
                  type="button"
                  disabled={isLoggingOut}
                  className="shahrzad-wallet-surface flex h-12 w-12 items-center justify-center border border-white/20 p-2 text-white transition hover:bg-white/20"
                  aria-label="باز کردن منوی حساب کاربری"
                >
                  <ProfileCircle size={24} color="#fff" variant="Bold" />
                </button>
              </Dropdown>
            )}
            {showWallet && (
              <WalletAction isLoading={isWalletLoading} variant="desktop" />
            )}
          </div>
        </nav>

        <div className="relative h-21 md:hidden">
          {showAccount && (
            <Dropdown
              disabled={isLoggingOut}
              menu={{ items, onClick: handleMenuClick }}
              trigger={["click"]}
            >
              <button
                type="button"
                disabled={isLoggingOut}
                className="absolute right-5 top-7 z-10 flex h-6 w-6 items-center justify-center text-white"
                aria-label="حساب کاربری"
              >
                <ProfileCircle size={24} color="#fff" />
              </button>
            </Dropdown>
          )}
          <Link
            href="/home"
            aria-label="صفحه اصلی شهرزاد"
            aria-hidden={isCompact}
            tabIndex={isCompact ? -1 : 0}
            className={`pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 shahrzad-header-transition ${
              isCompact
                ? "h-4 w-12 scale-75 opacity-0"
                : "pointer-events-auto h-8 w-24 scale-100 opacity-100"
            }`}
          >
            <Image
              src="/assets/logo.svg"
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
            className={`absolute left-5 top-7 z-10 flex h-6 w-6 items-center justify-center text-white shahrzad-header-transition ${
              isCompact
                ? "pointer-events-none -translate-y-1 opacity-0"
                : "opacity-100"
            }`}
            aria-label="اسکن"
          >
            <ScanBarcodeIcon size={24} color="#fff" />
          </button>
          <button
            type="button"
            disabled
            className={`absolute top-7 z-10 flex h-6 w-6 items-center justify-center text-white shahrzad-header-transition ${
              isCompact ? "left-5" : "left-15"
            }`}
            aria-label="اعلان ها"
          >
            <Notification size={24} color="#fff" />
          </button>
          {showWallet && (
            <WalletAction
              isCompact={isCompact}
              isLoading={isWalletLoading}
              variant="mobile"
            />
          )}
        </div>
      </div>
    </header>
  );
}
