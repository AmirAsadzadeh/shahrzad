type Props = {
  className?: string;
};

export function ServiceTileMoreIndicator({ className = "" }: Props) {
  return (
    <span
      aria-hidden="true"
      className={`absolute -bottom-4 -left-[0.3rem] h-6 w-6 ${className}`.trim()}
    >
      <svg width="23" height="11" viewBox="0 0 23 11" fill="none">
        <path
          d="M17.5 1C19.9853 1 22 3.01472 22 5.5C22 7.98528 19.9853 10 17.5 10H5.5C3.01472 10 1 7.98528 1 5.5C1 3.01472 3.01472 1 5.5 1H17.5Z"
          fill="currentColor"
        />
        <path
          d="M17.5 1C19.9853 1 22 3.01472 22 5.5C22 7.98528 19.9853 10 17.5 10H5.5C3.01472 10 1 7.98528 1 5.5C1 3.01472 3.01472 1 5.5 1H17.5Z"
          stroke="white"
          strokeWidth="2"
        />
        <circle cx="7.5" cy="5.5" r="1.5" fill="white" />
        <circle cx="11.5" cy="5.5" r="1.5" fill="white" />
        <circle cx="15.5" cy="5.5" r="1.5" fill="white" />
      </svg>
    </span>
  );
}
