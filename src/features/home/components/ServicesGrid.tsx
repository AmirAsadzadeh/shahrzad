import { Alert, Button } from "antd";
import type { ServiceTile as ServiceTileModel } from "@/entities/home/model/types";
import { ServiceTile } from "@/features/home/components/ServiceTile";
import { ServiceTileSkeleton } from "@/features/home/components/ServiceTileSkeleton";

const SERVICE_SKELETON_COUNT = 24;

type Props = {
  error: unknown;
  isLoading: boolean;
  onRetry: () => void;
  tiles: ServiceTileModel[];
};

export function ServicesGrid({ error, isLoading, onRetry, tiles }: Props) {
  return (
    <div
      aria-busy={isLoading}
      className="grid grid-cols-4 rounded-2xl bg-white p-4 tile-shadow md:grid-cols-6"
    >
      <ServicesGridContent error={error} isLoading={isLoading} onRetry={onRetry} tiles={tiles} />
    </div>
  );
}

function ServicesGridContent({ error, isLoading, onRetry, tiles }: Props) {
  if (isLoading) {
    return (
      <>
        <span className="sr-only" role="status">
          در حال بارگذاری خدمات
        </span>
        {Array.from({ length: SERVICE_SKELETON_COUNT }, (_, index) => (
          <ServiceTileSkeleton key={`service-skeleton-${index}`} />
        ))}
      </>
    );
  }

  if (error) {
    return (
      <Alert
        className="col-span-4 md:col-span-6"
        type="error"
        showIcon
        message="خطا در بارگذاری خدمات"
        description="متاسفانه مشکلی در نمایش خدمات پیش آمده، لطفا دوباره تلاش کنید."
        action={<Button onClick={onRetry}>تلاش دوباره</Button>}
      />
    );
  }

  if (tiles.length === 0) {
    return (
      <p className="col-span-4 py-8 text-center text-sm text-neutral-500 md:col-span-6">
        خدمتی برای نمایش وجود ندارد
      </p>
    );
  }

  return tiles.map((tile) => <ServiceTile key={tile.id} tile={tile} />);
}
