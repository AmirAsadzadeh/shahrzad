import type { ServiceTile as ServiceTileModel } from "@/entities/home/model/types";
import { ServiceGridError } from "@/features/home/components/ServiceGridError";
import { ServiceGrid } from "@/features/home/components/ServiceGrid";

type Props = {
  error: unknown;
  isLoading: boolean;
  onRetry: () => void;
  tiles: ServiceTileModel[];
};

export function ServicesGrid({ error, isLoading, onRetry, tiles }: Props) {
  if (error) return <ServiceGridError onRetry={onRetry} />;

  return <ServiceGrid isLoading={isLoading} tiles={tiles} />;
}
