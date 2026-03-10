export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-sand-200 rounded-lg ${className}`}
      aria-hidden="true"
    />
  );
}
