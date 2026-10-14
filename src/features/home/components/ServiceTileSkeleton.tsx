type Props = {
  className?: string;
};

export function ServiceTileSkeleton({ className = "" }: Props) {
  return (
    <div className={`flex flex-col items-center md:flex-row md:justify-center md:gap-2 ${className}`} aria-hidden="true">
      <span className="h-16 w-16 rounded-2xl bg-[#f7f7f7] animate-shimmer supports-[corner-shape:squircle]:rounded-[999px] supports-[corner-shape:squircle]:[corner-shape:squircle] md:h-[50px] md:w-[50px]" />
      <span className="mt-0.5 h-2.5 w-14 rounded bg-[#f7f7f7] animate-shimmer md:mt-0 md:h-4 md:w-20" />
    </div>
  );
}
