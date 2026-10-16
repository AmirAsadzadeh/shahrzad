import { Button } from "antd";

type Props = {
  onRetry: () => void;
};

export function ServiceGridError({ onRetry }: Props) {
  return (
    <div role="alert" className="col-span-4 flex flex-col items-center gap-3 py-8 text-center">
      <p className="text-sm text-neutral-600">دریافت خدمات شهرزاد انجام نشد.</p>
      <Button onClick={onRetry}>تلاش دوباره</Button>
    </div>
  );
}
