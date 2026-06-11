"use client";

export default function ErrorState({
  title = "Something went wrong",
  description = "Please try again.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex w-full flex-col items-center justify-center rounded-xl border border-[#DC2626] bg-white px-6 py-12 text-center">
      <div className="text-lg font-semibold text-[#DC2626]">{title}</div>
      <div className="mt-2 max-w-md text-sm leading-6 text-[#7F1D1D]">
        {description}
      </div>
    </div>
  );
}

