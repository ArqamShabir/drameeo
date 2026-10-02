import clsx from 'clsx'

export default function Badge({ children, className = '', variant = 'outline' }) {
  return (
    <span
      className={clsx(
        'text-xs font-medium px-3 py-1 rounded-full select-none',
        variant === 'outline' && 'border border-white/25 text-white/80 bg-white/8',
        variant === 'solid'   && 'bg-accent text-white',
        variant === 'muted'   && 'bg-white/10 text-text-secondary',
        className
      )}
    >
      {children}
    </span>
  )
}
