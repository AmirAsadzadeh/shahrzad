"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider, App as AntApp } from "antd";
import faIR from "antd/locale/fa_IR";
import { SWRConfig } from "swr";
import { isAppError } from "@/shared/api/errors";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AntdRegistry>
      <ConfigProvider
        direction="rtl"
        locale={faIR}
        theme={{
          token: {
            colorPrimary: "#307fe2",
            borderRadius: 8,
            fontFamily: "var(--font-shahrzad), Vazirmatn, Tahoma, Arial, sans-serif"
          },
          components: {
            Button: {
              controlHeight: 40,
              borderRadius: 12
            },
            Input: {
              controlHeight: 44,
              borderRadius: 12
            },
            Tabs: {
              itemSelectedColor: "#307fe2",
              inkBarColor: "#307fe2"
            }
          }
        }}
      >
        <AntApp>
          <SWRConfig
            value={{
              shouldRetryOnError: true,
              errorRetryCount: 2,
              errorRetryInterval: 1000,
              onErrorRetry: (error, _key, _config, revalidate, { retryCount }) => {
                if (isAppError(error) && error.status >= 400 && error.status < 500) return;
                if (retryCount >= 2) return;
                setTimeout(() => revalidate({ retryCount }), 1000);
              }
            }}
          >
            {children}
          </SWRConfig>
        </AntApp>
      </ConfigProvider>
    </AntdRegistry>
  );
}
