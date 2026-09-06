
const Paginator = ({
    page,
    setPage,
    totalPages
}) => {
    return (
        <div className="flex items-center justify-center gap-2 sm:gap-4 p-2 sm:p-4 text-xs sm:text-sm">
            <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-border dark:border-dark-border bg-card dark:bg-dark-card
                text-foreground dark:text-dark-foreground hover:bg-muted dark:hover:bg-dark-muted
                disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer font-medium"
            >
                Prev
            </button>

            <div
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-secondary dark:bg-dark-secondary
                text-secondary-foreground dark:text-dark-secondary-foreground font-semibold"
            >
                {page} / {totalPages}
            </div>

            <button
                type="button"
                disabled={page === totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-border dark:border-dark-border bg-card dark:bg-dark-card
                text-foreground dark:text-dark-foreground hover:bg-muted dark:hover:bg-dark-muted
                disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer font-medium"
            >
                Next
            </button>
        </div>
    )
}

export default Paginator