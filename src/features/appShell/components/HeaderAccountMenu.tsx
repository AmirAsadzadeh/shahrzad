"use client";

import { App as AntApp, Dropdown } from "antd";
import type { MenuProps } from "antd";
import { Logout, ProfileCircle, Setting2 } from "iconsax-react";
import { useLogout } from "@/features/auth/public";
import { getErrorMessage } from "@/shared/api/errors";

type Props = {
  variant: "desktop" | "mobile";
};

export function HeaderAccountMenu({ variant }: Props) {
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

  const isDesktop = variant === "desktop";

  return (
    <Dropdown
      disabled={isLoggingOut}
      menu={{ items, onClick: handleMenuClick }}
      trigger={["click"]}
    >
      <button
        type="button"
        disabled={isLoggingOut}
        className={
          isDesktop
            ? "shahrzad-wallet-surface flex h-12 w-12 items-center justify-center border border-white/20 p-2 text-white transition hover:bg-white/20"
            : "absolute right-5 top-7 z-10 flex h-6 w-6 items-center justify-center text-white"
        }
        aria-label={isDesktop ? "باز کردن منوی حساب کاربری" : "حساب کاربری"}
      >
        <ProfileCircle size={24} color="#fff" variant={isDesktop ? "Bold" : "Linear"} />
      </button>
    </Dropdown>
  );
}
