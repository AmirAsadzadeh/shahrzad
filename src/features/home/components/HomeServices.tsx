import { Alert, Button } from "antd";
import type { HomePayload } from "@/entities/home/model/types";
import { ServiceGrid } from "@/features/home/components/ServiceGrid";

type Props = {
  data?: HomePayload;
  error: unknown;
  isLoading: boolean;
  onRetry: () => void;
};

export function HomeServices({ data, error, isLoading, onRetry }: Props) {
  if (error && !data) {
    return <HomeServicesError onRetry={onRetry} />;
  }

  return (
    <>
      {error && <HomeServicesError onRetry={onRetry} />}
      <ServiceGrid isLoading={isLoading} tiles={data?.tiles ?? []} />
    </>
  );
}

export function HomeServicesError({ onRetry }: { onRetry: () => void }) {
  return (
    <Alert
      type="error"
      showIcon
      title="خطا در بارگذاری اطلاعات"
      description="متاسفانه مشکلی در نمایش خدمات پیش آمده، لطفا دوباره تلاش کنید."
      action={<Button onClick={onRetry}>تلاش دوباره</Button>}
      className="mb-5"
    />
  );
}
