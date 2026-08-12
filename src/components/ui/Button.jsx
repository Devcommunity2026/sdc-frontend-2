import React, { forwardRef } from 'react'
import { cva } from 'class-variance-authority';
import { cn } from '../../libs/utils';

const buttonVariants = cva(
    "rounded-lg cursor-pointer transition-all ease-in duration-100",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25",
                outline: " border-3  border-primary dark:border-primary text-primary dark:text-primary hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/25 ",

            },
            size: {
                default: "h-10 px-5 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-12 rounded-xl px-8 text-base",
                xl: "h-14 rounded-xl px-10 text-lg",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

const Spinner = () => (
    <svg
        className="animate-spin h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
    >
        <circle
            className="opacity-25"
            cx="12" cy="12" r="10"
            stroke="currentColor"
            strokeWidth="4"
        />
        <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
    </svg>
);

const Button = forwardRef(({ className, variant, size, loading, disabled, children, ...props }, ref) => {
    const isDisabled = loading || disabled;
    return (
        <button
            className={cn(
                buttonVariants({ variant, size, className }),
                isDisabled && "opacity-60 pointer-events-none"
            )}
            ref={ref}
            disabled={isDisabled}
            onClick={props.onClick}
        >
            {loading ? (
                <span className="flex items-center justify-center gap-2">
                    <Spinner />
                    <span>{children}</span>
                </span>
            ) : (
                children
            )}
        </button>
    )
})

export default Button
