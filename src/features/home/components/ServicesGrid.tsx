import type { ServiceTile as ServiceTileModel } from "@/entities/home/model/types";
import { ServiceTile } from "@/features/home/components/ServiceTile";
import { ServiceTileSkeleton } from "@/features/home/components/ServiceTileSkeleton";

const SERVICE_SKELETON_COUNT = 18;

type Props = {
  isLoading: boolean;
  tiles: ServiceTileModel[];
};

export function ServicesGrid({ isLoading, tiles }: Props) {
  return (
    <div className="grid grid-cols-4 rounded-2xl bg-white p-4 tile-shadow md:grid-cols-6">
      <ServicesGridContent isLoading={isLoading} tiles={tiles} />
    </div>
  );
}

function ServicesGridContent({ isLoading, tiles }: Props) {
  if (isLoading) {
    return Array.from({ length: SERVICE_SKELETON_COUNT }, (_, index) => (
      <ServiceTileSkeleton key={`service-skeleton-${index}`} />
    ));
  }

  return tiles.map((tile) => <ServiceTile key={tile.id} tile={tile} />);
}
