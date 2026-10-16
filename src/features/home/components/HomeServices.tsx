import type { HomePayload } from "@/entities/home/model/types";
import { ServiceGridError } from "@/features/home/components/ServiceGridError";
import { ServiceGrid } from "@/features/home/components/ServiceGrid";

type Props = {
  data?: HomePayload;
  error: unknown;
  isLoading: boolean;
  onRetry: () => void;
};

export function HomeServices({ data, error, isLoading, onRetry }: Props) {
  if (error && !data) return <ServiceGridError onRetry={onRetry} />;

  return <ServiceGrid isLoading={isLoading} tiles={data?.tiles ?? []} />;
}
