"use client";

export default function TableSkeleton({
  rows = 6,
}: {
  rows?: number;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
      <div className="grid grid-cols-4 gap-4 border-b border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-xs font-semibold text-[#475569]">
        <span>Field 1</span>
        <span>Field 2</span>
        <span>Field 3</span>
        <span>Field 4</span>
      </div>

      <div className="divide-y divide-[#E2E8F0]">
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="grid grid-cols-4 gap-4 px-4 py-3">
            {Array.from({ length: 4 }).map((__, jdx) => (
              <div
                key={jdx}
                className="h-3 w-full rounded bg-[#E2E8F0] opacity-70"
              />
            ))}
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.55;
          }
          50% {
            opacity: 1;
          }
        }
        div {
          animation: pulse 1.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

