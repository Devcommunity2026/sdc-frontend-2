import React from 'react';

export const VerificationSkeleton = () => {
  return (
    <div
      className="max-w-4xl mx-auto animate-pulse space-y-6"
      role="status"
      aria-label="Loading certificate details"
    >
      {/* Top Status Banner Skeleton */}
      <div className="bg-slate-200 h-24 rounded-2xl w-full"></div>

      {/* Main Content Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left / Info Column Skeleton */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
            <div className="h-4 bg-slate-200 rounded w-1/3"></div>
            <div className="h-8 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            <div className="h-6 bg-slate-200 rounded w-full"></div>
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="h-4 bg-slate-200 rounded w-1/4"></div>
              <div className="h-5 bg-slate-200 rounded w-2/3"></div>
            </div>
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="h-4 bg-slate-200 rounded w-1/3"></div>
              <div className="h-8 bg-slate-200 rounded w-full"></div>
            </div>
          </div>
        </div>

        {/* Right / Document Preview Skeleton (Medium and larger screens) */}
        <div className="hidden md:block md:col-span-7">
          <div className="bg-slate-200 h-[600px] rounded-2xl w-full"></div>
        </div>
      </div>
      <span className="sr-only">Loading certificate verification status...</span>
    </div>
  );
};

export default VerificationSkeleton;
