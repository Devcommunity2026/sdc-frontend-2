
const Paginator = ({
    page,
    setPage,
    totalPages
}) => {
    return (
        <div className="flex items-center justify-center gap-4 p-5">
            <button
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                className="px-4 py-2 rounded-lg border border-border dark:border-dark-border bg-card dark:bg-dark-card
                text-foreground dark:text-dark-foreground hover:bg-muted dark:hover:bg-dark-muted
                disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
                Prev
            </button>

            <div
                className="px-4 py-2 rounded-lg bg-secondary dark:bg-dark-secondary
                text-secondary-foreground dark:text-dark-secondary-foreground font-medium"
            >
                {page} / {totalPages}
            </div>

            <button
                disabled={page === totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className="px-4 py-2 rounded-lg border border-border dark:border-dark-border bg-card dark:bg-dark-card
                text-foreground dark:text-dark-foreground hover:bg-muted dark:hover:bg-dark-muted
                disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
                Next
            </button>
        </div>
    )
}

export default Paginator