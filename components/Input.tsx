export function Input({
    className = '',
    ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            className={`w-full bg-[var(--color-surface)]/40 backdrop-blur-md border border-[var(--color-border)] rounded-lg px-4 py-2 text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all shadow-inner ${className}`}
            {...props}
        />
    )
}
