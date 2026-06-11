"use client";

import Image from "next/image";

export default function LoadingSpinner({
  size = 32,
  label = "Loading...",
}: {
  size?: number;
  label?: string;
}) {
  return (
    <div
      className="inline-flex items-center justify-center"
      aria-label={label}
      role="status"
    >
      <div
        className="relative"
        style={{ width: size, height: size }}
      >
        <Image
          src="/favicon.ico"
          alt=""
          fill
          className="animate-spin-slow object-contain"
          priority
        />
      </div>

      <style jsx>{`
        @keyframes spinSlow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spinSlow 1.1s linear infinite;
        }
      `}</style>
    </div>
  );
}

