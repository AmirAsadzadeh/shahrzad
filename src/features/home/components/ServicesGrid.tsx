import type { ServiceTile as ServiceTileModel } from "@/entities/home/model/types";
import { ServiceGrid } from "@/features/home/components/ServiceGrid";

type Props = {
  error: unknown;
  isLoading: boolean;
  tiles: ServiceTileModel[];
};

export function ServicesGrid({ error, isLoading, tiles }: Props) {
  if (error) return null;

  return <ServiceGrid isLoading={isLoading} tiles={tiles} />;
}
