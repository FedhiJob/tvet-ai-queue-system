"use client";

export default function EmptyState({
  title = "Nothing here yet",
  description = "",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex w-full flex-col items-center justify-center rounded-xl border border-[#E2E8F0] bg-white px-6 py-12 text-center">
      <div className="text-lg font-semibold text-[#0F172A]">{title}</div>
      {description ? (
        <div className="mt-2 max-w-md text-sm leading-6 text-[#475569]">
          {description}
        </div>
      ) : null}
    </div>
  );
}

