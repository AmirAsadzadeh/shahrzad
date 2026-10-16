import { Button } from "antd";

type Props = {
  onRetry: () => void;
};

export function SessionLoadError({ onRetry }: Props) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-shahrzad-background px-6 text-center">
      <div role="alert">
        <h1 className="text-xl font-bold text-neutral-900">دریافت اطلاعات حساب انجام نشد</h1>
        <p className="mt-2 text-sm leading-7 text-neutral-600">
          لطفا اتصال خود را بررسی و دوباره تلاش کنید.
        </p>
      </div>
      <Button type="primary" className="mt-6" onClick={onRetry}>
        تلاش دوباره
      </Button>
    </main>
  );
}
