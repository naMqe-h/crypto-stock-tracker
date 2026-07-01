export function Card({
    children,
    className = ''
}: {
    children: React.ReactNode
    className?: string
}) {
    return (
        <div className={`bg-[var(--color-surface)]/60 backdrop-blur-xl border border-[var(--color-border)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden ${className}`}>
            {children}
        </div>
    )
}
