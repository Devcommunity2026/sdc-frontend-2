import React from "react";
import { MoreVertical, Ban, Edit } from "lucide-react";

const ContentRow = ({
    user,
    curr,
    openMenu,
    setOpenMenu,
    handleDeleteContent,
    refreshUsers,
    onEditClick
}) => {
    return (
        <div
            className="relative flex min-h-16 min-w-[760px] w-full px-4 border-b border-border dark:border-dark-border last:border-none hover:bg-secondary/50 dark:hover:bg-dark-secondary/50 transition-colors duration-200"
        >
            {/* TITLE / NAME */}
            <div className="w-[25%] flex items-center py-4 text-card-foreground dark:text-dark-card-foreground font-semibold">
                <span className="truncate pr-4">{user.title || user.name}</span>
            </div>

            {/* DESCRIPTION / SUBHEADING */}
            <div className="w-[35%] flex items-center py-4 break-all text-muted-foreground dark:text-dark-muted-foreground text-sm">
                <span className="truncate pr-4">{user.subHeading || user.email || "No Data"}</span>
            </div>

            {/* TYPE BADGE */}
            <div className="w-[20%] flex items-center py-4">
                <span
                    className="rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-semibold capitalize text-primary dark:bg-dark-primary/20 dark:text-dark-primary"
                >
                    {curr}
                </span>
            </div>

            {/* ACTIONS */}
            <div className="w-[20%] flex items-center justify-center relative">
                <button
                    onClick={() =>
                        setOpenMenu(
                            openMenu === user._id ? null : user._id
                        )
                    }
                    className="h-10 w-10 rounded-lg flex items-center justify-center border border-border dark:border-dark-border bg-secondary dark:bg-dark-secondary hover:bg-muted dark:hover:bg-dark-muted transition cursor-pointer"
                >
                    <MoreVertical size={18} />
                </button>

                {/* DROPDOWN */}
                {openMenu === user._id && (
                    <div className="absolute top-14 right-5 z-50 w-52 rounded-xl border border-border dark:border-dark-border bg-card dark:bg-dark-card shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                        {/* EDIT CONTENT */}
                        {(curr === "Blogs" || curr === "Events" || curr === "Projects") && (
                            <button
                                onClick={() => {
                                    setOpenMenu(null);
                                    onEditClick(user);
                                }}
                                className="w-full px-4 py-3 flex items-center gap-3 text-sm text-foreground dark:text-dark-foreground hover:bg-muted dark:hover:bg-dark-muted transition cursor-pointer text-left border-b border-border dark:border-dark-border"
                            >
                                <Edit size={16} />
                                Edit {curr === "Blogs" ? "Blog" : curr === "Events" ? "Event" : "Project"}
                            </button>
                        )}

                        {/* DELETE CONTENT */}
                        <button
                            onClick={() => {
                                setOpenMenu(null);
                                handleDeleteContent(user._id, curr, refreshUsers);
                            }}
                            className="w-full px-4 py-3 flex items-center gap-3 text-sm text-danger dark:text-dark-danger hover:bg-danger/10 dark:hover:bg-dark-danger/15 transition cursor-pointer text-left"
                        >
                            <Ban size={16} />
                            Delete {curr === "Blogs" ? "Blog" : curr === "Events" ? "Event" : curr === "Projects" ? "Project" : "Content"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContentRow;
