type Props = {
  className?: string;
};

export function ServiceTileSkeleton({ className = "" }: Props) {
  return (
    <div
      className={`flex flex-col items-center text-center md:flex-row md:justify-center md:text-right ${className}`}
      aria-hidden="true"
    >
      <span className="h-16 w-16 shrink-0 rounded-2xl bg-shahrzad-surface-soft animate-shimmer supports-[corner-shape:squircle]:rounded-full supports-[corner-shape:squircle]:[corner-shape:squircle]" />
      <span className="mt-2 h-2.5 w-14 max-w-19 rounded bg-shahrzad-surface-soft animate-shimmer md:mr-4 md:mt-0 md:h-4 md:w-20 md:max-w-33" />
    </div>
  );
}
