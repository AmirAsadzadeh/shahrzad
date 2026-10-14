import { ServiceTileSkeleton } from "@/features/home/components/ServiceTileSkeleton";

const SERVICE_SKELETON_COUNT = 24;
const DESKTOP_SKELETON_COUNT = 16;

export function ServiceGridSkeleton() {
  return (
    <>
      {Array.from({ length: SERVICE_SKELETON_COUNT }, (_, index) => (
        <ServiceTileSkeleton
          key={`service-skeleton-${index}`}
          className={index >= DESKTOP_SKELETON_COUNT ? "md:hidden" : undefined}
        />
      ))}
    </>
  );
}
