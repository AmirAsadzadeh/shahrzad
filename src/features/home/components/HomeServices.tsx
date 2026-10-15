import type { HomePayload } from "@/entities/home/model/types";
import { ServiceGrid } from "@/features/home/components/ServiceGrid";

type Props = {
  data?: HomePayload;
  error: unknown;
  isLoading: boolean;
};

export function HomeServices({ data, error, isLoading }: Props) {
  if (error && !data) return null;

  return <ServiceGrid isLoading={isLoading} tiles={data?.tiles ?? []} />;
}
