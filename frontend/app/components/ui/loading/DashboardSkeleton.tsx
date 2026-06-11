"use client";

export default function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-xl border border-[#E2E8F0] bg-white"
          />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 h-64 rounded-xl border border-[#E2E8F0] bg-white" />
        <div className="h-64 rounded-xl border border-[#E2E8F0] bg-white" />
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

