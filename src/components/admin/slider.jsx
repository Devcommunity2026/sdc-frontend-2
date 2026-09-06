import React from 'react'

const Slider = ({ type, curr, setCurr, setPage }) => {
    return (
        <div className="w-full sm:w-fit max-w-full overflow-x-auto no-scrollbar">
            <div
                className="flex w-full sm:w-fit min-w-full sm:min-w-0 items-center gap-1 sm:gap-1.5 rounded-xl border border-border bg-secondary/80 p-1 dark:border-dark-border dark:bg-dark-secondary/80"
            >
                {type.map((item, index) => {
                    const isActive = curr === item;
                    return (
                        <button
                            key={index}
                            type="button"
                            onClick={() => {
                                setCurr(item);
                                setPage(1);
                            }}
                            className={`flex-1 sm:flex-initial shrink-0 whitespace-nowrap px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer text-center select-none ${
                                isActive
                                    ? "bg-primary dark:bg-dark-primary text-primary-foreground dark:text-dark-primary-foreground shadow-sm"
                                    : "text-muted-foreground dark:text-dark-muted-foreground hover:text-foreground dark:hover:text-dark-foreground hover:bg-card/50 dark:hover:bg-dark-card/50"
                            }`}
                        >
                            {item}
                        </button>
                    );
                })}
            </div>
        </div>
    )
}

export default Slider
