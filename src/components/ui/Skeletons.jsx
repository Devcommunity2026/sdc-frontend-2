import React from "react";

// ================= MENTOR CARD SKELETON =================
export const MentorCardSkeleton = () => {
  return (
    <div
      className="
        relative overflow-hidden rounded-3xl
        max-w-sm mx-auto w-full
        border border-border dark:border-dark-border
        bg-card dark:bg-dark-card
        shadow-sm animate-pulse
      "
    >
      <div className="px-5 pt-8 pb-6 text-center flex flex-col items-center">
        {/* Profile Avatar Skeleton */}
        <div className="w-24 h-24 rounded-full bg-muted dark:bg-dark-muted mb-4 ring-4 ring-border/50 dark:ring-dark-border/50" />

        {/* Name Skeleton */}
        <div className="h-5 w-36 rounded-md bg-muted dark:bg-dark-muted mb-2" />

        {/* Position Skeleton */}
        <div className="h-4 w-24 rounded-md bg-primary/20 dark:bg-dark-primary/25 mb-4" />

        {/* Description Lines Skeleton */}
        <div className="w-full space-y-2 mt-1">
          <div className="h-3 w-4/5 mx-auto rounded bg-muted/70 dark:bg-dark-muted/70" />
          <div className="h-3 w-3/5 mx-auto rounded bg-muted/60 dark:bg-dark-muted/60" />
        </div>
      </div>
    </div>
  );
};

export const MentorGridSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <MentorCardSkeleton key={i} />
      ))}
    </div>
  );
};

// ================= TEAM CARD SKELETON =================
export const TeamCardSkeleton = () => {
  return (
    <div
      className="
        relative overflow-hidden rounded-3xl border
        border-border dark:border-dark-border
        bg-card dark:bg-dark-card
        shadow-sm animate-pulse w-full
      "
    >
      {/* Top Accent line */}
      <div className="h-1.5 w-full bg-primary/25 dark:bg-dark-primary/25" />

      <div className="px-6 py-8 flex flex-col items-center text-center">
        {/* Avatar Skeleton */}
        <div className="w-24 h-24 rounded-full bg-muted dark:bg-dark-muted mb-5 ring-4 ring-primary/20" />

        {/* Name Skeleton */}
        <div className="h-5 w-32 rounded-md bg-muted dark:bg-dark-muted mb-3" />

        {/* Post Pill Skeleton */}
        <div className="h-6 w-28 rounded-full bg-primary/15 dark:bg-dark-primary/20 mb-5" />

        {/* Divider */}
        <div className="w-full h-px bg-border/60 dark:bg-dark-border/60 mb-5" />

        {/* LinkedIn Button Skeleton */}
        <div className="h-9 w-28 rounded-full border border-primary/25 bg-primary/10 dark:bg-dark-primary/15" />
      </div>
    </div>
  );
};

export const TeamGridSkeleton = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <TeamCardSkeleton key={i} />
      ))}
    </div>
  );
};

// ================= ALUMNI ROW SKELETON =================
export const AlumniRowSkeleton = () => {
  return (
    <div className="p-3.5 sm:px-6 sm:py-4 rounded-xl border border-border dark:border-dark-border bg-card dark:bg-dark-card shadow-xs animate-pulse">
      {/* Mobile Skeleton */}
      <div className="sm:hidden flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 flex-1">
            <div className="w-8 h-8 rounded-full bg-primary/15 dark:bg-dark-primary/20 shrink-0" />
            <div className="h-4 w-32 rounded bg-muted dark:bg-dark-muted" />
          </div>
          <div className="h-5 w-20 rounded-full bg-primary/15 dark:bg-dark-primary/20 shrink-0" />
        </div>
        <div className="pl-10.5">
          <div className="h-6 w-28 rounded-lg bg-secondary dark:bg-dark-secondary" />
        </div>
      </div>

      {/* Desktop Skeleton */}
      <div className="hidden sm:grid sm:grid-cols-12 gap-4 items-center w-full">
        <div className="col-span-5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/15 dark:bg-dark-primary/20 shrink-0" />
          <div className="h-4 w-36 rounded bg-muted dark:bg-dark-muted" />
        </div>
        <div className="col-span-4 flex items-center gap-2">
          <div className="h-6 w-32 rounded-md bg-secondary dark:bg-dark-secondary" />
        </div>
        <div className="col-span-3 flex items-center justify-end">
          <div className="h-6 w-24 rounded-full bg-primary/15 dark:bg-dark-primary/20" />
        </div>
      </div>
    </div>
  );
};

export const AlumniListSkeleton = ({ count = 7 }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-2.5">
      {/* Header Skeleton */}
      <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3.5 mb-3 rounded-xl border border-border/60 dark:border-dark-border/60 bg-secondary/70 dark:bg-dark-secondary/70">
        <div className="col-span-5 h-3.5 w-24 rounded bg-muted/70 dark:bg-dark-muted/70" />
        <div className="col-span-4 h-3.5 w-20 rounded bg-muted/70 dark:bg-dark-muted/70" />
        <div className="col-span-3 h-3.5 w-24 rounded bg-muted/70 dark:bg-dark-muted/70 sm:ml-auto" />
      </div>

      {/* Rows */}
      {Array.from({ length: count }).map((_, i) => (
        <AlumniRowSkeleton key={i} />
      ))}
    </div>
  );
};

// ================= PROJECT CARD SKELETON =================
export const ProjectCardSkeleton = () => {
  return (
    <div
      className="
        overflow-hidden rounded-2xl border border-border bg-card text-card-foreground
        shadow-sm dark:border-dark-border dark:bg-dark-card animate-pulse
      "
    >
      {/* Thumbnail */}
      <div className="h-52 w-full bg-muted dark:bg-dark-muted" />

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <div className="h-6 w-44 rounded-md bg-muted dark:bg-dark-muted mb-2" />

        {/* Subtitle */}
        <div className="h-4 w-32 rounded-md bg-primary/20 dark:bg-dark-primary/25 mb-4" />

        {/* Description */}
        <div className="space-y-2 mb-5">
          <div className="h-3 w-full rounded bg-muted/70 dark:bg-dark-muted/70" />
          <div className="h-3 w-5/6 rounded bg-muted/70 dark:bg-dark-muted/70" />
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2">
          <div className="h-6 w-14 rounded-full bg-primary/10 dark:bg-dark-primary/15" />
          <div className="h-6 w-20 rounded-full bg-primary/10 dark:bg-dark-primary/15" />
          <div className="h-6 w-16 rounded-full bg-primary/10 dark:bg-dark-primary/15" />
        </div>
      </div>
    </div>
  );
};

export const ProjectGridSkeleton = ({ count = 6 }) => {
  return (
    <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </div>
  );
};

// ================= EVENT CARD SKELETON =================
export const EventCardSkeleton = () => {
  return (
    <div
      className="
        overflow-hidden rounded-2xl border border-border bg-card text-card-foreground
        shadow-sm dark:border-dark-border dark:bg-dark-card animate-pulse
      "
    >
      {/* Thumbnail */}
      <div className="h-52 w-full bg-muted dark:bg-dark-muted" />

      {/* Content */}
      <div className="p-5">
        {/* Date badge */}
        <div className="h-4 w-28 rounded-md bg-primary/20 dark:bg-dark-primary/25 mb-2.5" />

        {/* Title */}
        <div className="h-5 w-48 rounded-md bg-muted dark:bg-dark-muted mb-2" />

        {/* Subtitle */}
        <div className="h-3.5 w-32 rounded-md bg-muted/60 dark:bg-dark-muted/60 mb-3" />

        {/* Description */}
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-muted/70 dark:bg-dark-muted/70" />
          <div className="h-3 w-4/5 rounded bg-muted/70 dark:bg-dark-muted/70" />
        </div>
      </div>
    </div>
  );
};

export const EventGridSkeleton = ({ count = 6 }) => {
  return (
    <div className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <EventCardSkeleton key={i} />
      ))}
    </div>
  );
};

// ================= BLOG CARD SKELETON =================
export const BlogCardSkeleton = () => {
  return (
    <div
      className="
        flex h-[420px] flex-col justify-between overflow-hidden rounded-2xl
        border border-border bg-card text-card-foreground shadow-sm
        dark:border-dark-border dark:bg-dark-card animate-pulse
      "
    >
      <div>
        {/* Thumbnail */}
        <div className="h-48 w-full bg-muted dark:bg-dark-muted" />

        {/* Content */}
        <div className="p-5">
          {/* Date & Read time */}
          <div className="flex items-center gap-3 mb-3">
            <div className="h-3.5 w-20 rounded bg-muted/80 dark:bg-dark-muted/80" />
            <div className="h-3.5 w-16 rounded bg-muted/80 dark:bg-dark-muted/80" />
          </div>

          {/* Title */}
          <div className="h-5 w-52 rounded-md bg-muted dark:bg-dark-muted mb-2" />

          {/* Description */}
          <div className="space-y-2">
            <div className="h-3.5 w-full rounded bg-muted/70 dark:bg-dark-muted/70" />
            <div className="h-3.5 w-3/4 rounded bg-muted/60 dark:bg-dark-muted/60" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border/80 dark:border-dark-border/60 px-5 py-4 bg-muted/20">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/20 dark:bg-dark-primary/25" />
          <div className="h-3.5 w-16 rounded bg-muted dark:bg-dark-muted" />
        </div>
        <div className="h-3.5 w-20 rounded bg-primary/20 dark:bg-dark-primary/25" />
      </div>
    </div>
  );
};

export const BlogGridSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  );
};

// ================= ADMIN TABLE ROW SKELETON =================
export const AdminTableRowSkeleton = () => {
  return (
    <div className="flex min-w-[760px] items-center border-b border-border/50 dark:border-dark-border/50 px-4 py-4 animate-pulse">
      <div className="flex w-[25%] items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-muted dark:bg-dark-muted shrink-0" />
        <div className="h-4 w-28 rounded bg-muted dark:bg-dark-muted" />
      </div>
      <div className="flex w-[35%] items-center">
        <div className="h-4 w-44 rounded bg-muted/80 dark:bg-dark-muted/80" />
      </div>
      <div className="flex w-[20%] items-center">
        <div className="h-6 w-20 rounded-full bg-primary/15 dark:bg-dark-primary/20" />
      </div>
      <div className="flex w-[20%] items-center justify-end">
        <div className="h-8 w-8 rounded-md bg-muted/60 dark:bg-dark-muted/60" />
      </div>
    </div>
  );
};

export const AdminTableSkeleton = ({ count = 5 }) => {
  return (
    <div className="min-w-[760px]">
      {Array.from({ length: count }).map((_, i) => (
        <AdminTableRowSkeleton key={i} />
      ))}
    </div>
  );
};

// ================= APPLICATION CARD SKELETON =================
export const ApplicationCardSkeleton = () => {
  return (
    <div className="w-full bg-card p-5 lg:p-6 border-b border-border/50 dark:border-dark-border/50 dark:bg-dark-card animate-pulse">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start justify-between">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-6 w-40 rounded-md bg-muted dark:bg-dark-muted" />
            <div className="h-5 w-20 rounded-full bg-primary/15 dark:bg-dark-primary/20" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
            <div className="h-4 w-48 rounded bg-muted/70 dark:bg-dark-muted/70" />
            <div className="h-4 w-36 rounded bg-muted/70 dark:bg-dark-muted/70" />
            <div className="h-4 w-52 rounded bg-muted/70 dark:bg-dark-muted/70" />
            <div className="h-4 w-40 rounded bg-muted/70 dark:bg-dark-muted/70" />
          </div>

          <div className="flex gap-2 pt-2">
            <div className="h-6 w-16 rounded-md bg-secondary dark:bg-dark-secondary" />
            <div className="h-6 w-20 rounded-md bg-secondary dark:bg-dark-secondary" />
            <div className="h-6 w-14 rounded-md bg-secondary dark:bg-dark-secondary" />
          </div>
        </div>

        <div className="flex gap-2 shrink-0">
          <div className="h-9 w-24 rounded-lg bg-muted/80 dark:bg-dark-muted/80" />
          <div className="h-9 w-24 rounded-lg bg-muted/80 dark:bg-dark-muted/80" />
        </div>
      </div>
    </div>
  );
};

export const ApplicationListSkeleton = ({ count = 4 }) => {
  return (
    <div className="divide-y divide-border dark:divide-dark-border">
      {Array.from({ length: count }).map((_, i) => (
        <ApplicationCardSkeleton key={i} />
      ))}
    </div>
  );
};
