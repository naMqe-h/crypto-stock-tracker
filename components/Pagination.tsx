'use client'

import { useRouter, usePathname } from 'next/navigation'

interface PaginationProps {
    currentPage: number
    hasNextPage: boolean
}

export function Pagination({ currentPage, hasNextPage }: PaginationProps) {
    const router = useRouter()
    const pathname = usePathname()

    const handlePrevious = () => {
        if (currentPage > 1) {
            router.push(`${pathname}?page=${currentPage - 1}`)
        }
    }

    const handleNext = () => {
        if (hasNextPage) {
            router.push(`${pathname}?page=${currentPage + 1}`)
        }
    }

    return (
        <div className="flex items-center justify-center gap-4 mt-8">
            <button
                onClick={handlePrevious}
                disabled={currentPage <= 1}
                className="px-6 py-2 rounded-xl cursor-pointer bg-[var(--color-surface)]/50 backdrop-blur-md border border-[var(--color-border)] text-[var(--color-text-primary)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-surface-hover)] transition-all"
            >
                Previous
            </button>
            <span className="text-[var(--color-text-secondary)] font-medium">
                Page {currentPage}
            </span>
            <button
                onClick={handleNext}
                disabled={!hasNextPage}
                className="px-6 py-2 rounded-xl cursor-pointer bg-[var(--color-surface)]/50 backdrop-blur-md border border-[var(--color-border)] text-[var(--color-text-primary)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-surface-hover)] transition-all"
            >
                Next
            </button>
        </div>
    )
}
