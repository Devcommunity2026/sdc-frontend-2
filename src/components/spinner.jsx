import React from "react";

const Spinner = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background dark:bg-dark-background">
            <div className="relative">
                {/* Outer Ring */}
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-muted dark:border-dark-muted border-t-primary dark:border-t-dark-primary" />

                {/* Inner Glow */}
                <div className="absolute inset-2 animate-pulse rounded-full bg-primary/20 dark:bg-dark-primary/20" />
            </div>
        </div>
    );
};

export default Spinner;