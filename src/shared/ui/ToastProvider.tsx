"use client";

import { App as AntApp } from "antd";
import { useEffect } from "react";
import { useStore } from "zustand";
import { toastStore } from "@/shared/model/toastStore";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { message } = AntApp.useApp();
  const toast = useStore(toastStore, (state) => state.toast);

  useEffect(() => {
    if (!toast) return;

    if (toast.type === "error") {
      void message.error({ content: toast.message, key: "api-error" });
    }
  }, [message, toast]);

  return children;
}
