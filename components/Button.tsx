export function Button({
    children,
    className = '',
    variant = 'primary',
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'danger'
}) {
    const baseStyles = 'cursor-pointer px-4 py-2 rounded-lg font-medium transition-all duration-200 ease-in-out active:scale-95'
    
    const variants = {
        primary: 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-black shadow-[0_0_15px_rgba(74,222,128,0.4)]',
        secondary: 'bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-primary)] border border-[var(--color-surface-hover)]',
        danger: 'bg-[var(--color-danger)] text-black hover:opacity-90'
    }

    return (
        <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    )
}
