import React from "react";

const AdminPageHeader = ({ title, description, icon: Icon, actions }) => {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm dark:border-dark-border dark:bg-dark-card sm:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          {Icon && (
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-dark-primary/15 dark:text-dark-primary">
              <Icon size={21} />
            </span>
          )}

          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-foreground dark:text-dark-foreground sm:text-3xl">
              {title}
            </h1>
            {description && (
              <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground dark:text-dark-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </div>

        {actions && <div className="shrink-0">{actions}</div>}
      </div>
    </div>
  );
};

export default AdminPageHeader;
