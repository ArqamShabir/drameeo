import clsx from 'clsx'

/**
 * Reusable skeleton loader.
 * Usage: <Skeleton className="w-full h-48 rounded-xl" />
 */
export default function Skeleton({ className = '', style }) {
  return (
    <div
      className={clsx('skeleton', className)}
      style={style}
      aria-hidden="true"
    />
  )
}

/** Pre-built skeleton for a movie card (16:9 thumbnail + 2 text lines) */
export function MovieCardSkeleton({ wide = false }) {
  return (
    <div className={clsx('flex-shrink-0', wide ? 'w-64' : 'w-40')}>
      <Skeleton className={clsx('w-full mb-2', wide ? 'h-36' : 'h-56')} />
      <Skeleton className="w-3/4 h-3 mb-1.5 rounded-full" />
      <Skeleton className="w-1/2 h-2.5 rounded-full" />
    </div>
  )
}

/** Pre-built skeleton for the hero banner */
export function HeroBannerSkeleton() {
  return (
    <div className="skeleton w-full h-80 md:h-96 rounded-xl2 mb-6" />
  )
}

/** Horizontal row of card skeletons */
export function RowSkeleton({ count = 4, wide = false }) {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <MovieCardSkeleton key={i} wide={wide} />
      ))}
    </div>
  )
}
