import React from "react";
import { useNavigate } from "react-router-dom";

const NoAccess = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-background dark:bg-dark-background px-4">
            <div className="text-center">
                <div className="text-7xl mb-4">🔒</div>

                <h1 className="text-4xl font-bold text-foreground dark:text-dark-foreground mb-3">
                    Access Denied
                </h1>

                <p className="text-muted-foreground dark:text-dark-muted-foreground mb-8">
                    You don't have permission to view this page.
                </p>

                <button
                    onClick={() => navigate("/")}
                    className="px-6 py-3 rounded-lg bg-primary dark:bg-dark-primary text-primary-foreground dark:text-dark-primary-foreground font-medium hover:opacity-90 transition"
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
};

export default NoAccess;