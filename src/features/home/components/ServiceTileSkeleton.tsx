type Props = {
  className?: string;
};

export function ServiceTileSkeleton({ className = "" }: Props) {
  return (
    <div className={`flex flex-col items-center md:flex-row md:justify-center md:gap-2 ${className}`} aria-hidden="true">
      <span className="h-16 w-16 rounded-2xl bg-shahrzad-surface-soft animate-shimmer supports-[corner-shape:squircle]:rounded-full supports-[corner-shape:squircle]:[corner-shape:squircle] md:h-12.5 md:w-12.5" />
      <span className="mt-0.5 h-2.5 w-14 rounded bg-shahrzad-surface-soft animate-shimmer md:mt-0 md:h-4 md:w-20" />
    </div>
  );
}
