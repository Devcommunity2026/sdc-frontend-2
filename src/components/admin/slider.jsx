import React from 'react'

const Slider = ({ type, curr, setCurr, setPage }) => {
    return (
        <div
            className="flex w-full flex-wrap gap-2 rounded-xl border border-border bg-secondary p-1 dark:border-dark-border dark:bg-dark-secondary sm:inline-flex sm:w-fit"
        >
            {type.map((item, index) => (
                <button
                    key={index}
                    onClick={() => {
                        setCurr(item);
                        setPage(1);
                    }}
                    className={`min-w-0 flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer sm:flex-none sm:px-5
                                
                                ${curr === item
                            ? "bg-primary dark:bg-dark-primary text-primary-foreground dark:text-dark-primary-foreground shadow-md"
                            : "text-secondary-foreground dark:text-dark-secondary-foreground hover:bg-muted dark:hover:bg-dark-muted"
                        }
                                `}
                >
                    {item}
                </button>
            ))}
        </div>
    )
}

export default Slider
