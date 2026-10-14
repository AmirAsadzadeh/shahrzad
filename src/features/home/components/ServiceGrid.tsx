import type { ServiceTile as ServiceTileModel } from "@/entities/home/model/types";
import { ServiceTile } from "@/features/home/components/ServiceTile";
import { ServiceGridSkeleton } from "@/features/home/components/ServiceGridSkeleton";

type Props = {
  isLoading: boolean;
  tiles: ServiceTileModel[];
};

export function ServiceGrid({ isLoading, tiles }: Props) {
  return (
    <div
      className={`grid grid-cols-4 justify-items-stretch gap-y-4 md:gap-x-12 lg:gap-x-20 ${isLoading ? "md:gap-y-12" : "md:gap-y-14"}`}
    >
      <ServiceGridContent isLoading={isLoading} tiles={tiles} />
    </div>
  );
}

function ServiceGridContent({ isLoading, tiles }: Props) {
  if (isLoading) return <ServiceGridSkeleton />;

  if (tiles.length === 0) {
    return (
      <p className="col-span-4 py-8 text-center text-sm text-neutral-500">
        خدمتی برای نمایش وجود ندارد
      </p>
    );
  }

  return tiles.map((tile) => <ServiceTile key={tile.id} tile={tile} />);
}
