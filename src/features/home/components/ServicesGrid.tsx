import { Alert, Button } from "antd";
import type { ServiceTile as ServiceTileModel } from "@/entities/home/model/types";
import { ServiceGrid } from "@/features/home/components/ServiceGrid";

type Props = {
  error: unknown;
  isLoading: boolean;
  onRetry: () => void;
  tiles: ServiceTileModel[];
};

export function ServicesGrid({ error, isLoading, onRetry, tiles }: Props) {
  if (error) {
    return (
      <Alert
        type="error"
        showIcon
        title="خطا در بارگذاری خدمات"
        description="متاسفانه مشکلی در نمایش خدمات پیش آمده، لطفا دوباره تلاش کنید."
        action={<Button onClick={onRetry}>تلاش دوباره</Button>}
      />
    );
  }

  return <ServiceGrid isLoading={isLoading} tiles={tiles} />;
}
