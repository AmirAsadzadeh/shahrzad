import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "web.shahrzadcity.ir",
        pathname: "/assets/**"
      },
      {
        protocol: "https",
        hostname: "static.shahrzadcity.ir",
        pathname: "/base/**"
      }
    ]
  },
  async headers() {
    const connectSources = ["'self'"];
    if (process.env.NODE_ENV !== "production") connectSources.push("http://localhost:*", "ws://localhost:*");

    const scriptSources = ["'self'", "'unsafe-inline'"];
    if (process.env.NODE_ENV !== "production") scriptSources.push("'unsafe-eval'");

    const contentSecurityPolicy = [
      `default-src 'self'`,
      `base-uri 'self'`,
      `form-action 'self'`,
      `frame-ancestors 'none'`,
      `object-src 'none'`,
      `script-src ${scriptSources.join(" ")}`,
      `style-src 'self' 'unsafe-inline'`,
      `font-src 'self' data:`,
      `img-src 'self' data: blob: https://web.shahrzadcity.ir https://static.shahrzadcity.ir`,
      `connect-src ${connectSources.join(" ")}`,
      `frame-src 'none'`,
      `worker-src 'self' blob:`
    ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
          ...(process.env.NODE_ENV === "production"
            ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }]
            : [])
        ]
      }
    ];
  }
};

export default nextConfig;
