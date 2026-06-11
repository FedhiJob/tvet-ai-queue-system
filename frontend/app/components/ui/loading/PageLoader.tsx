"use client";

import LoadingSpinner from "./LoadingSpinner";

export default function PageLoader({
  title = "Loading",
}: {
  title?: string;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-6">
      <LoadingSpinner size={40} />
      <p className="text-sm font-medium text-[#475569]">{title}</p>
    </div>
  );
}

