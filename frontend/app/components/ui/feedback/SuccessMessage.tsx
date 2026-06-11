"use client";

export default function SuccessMessage({
  title = "Success",
  description = "",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex w-full flex-col items-center justify-center rounded-xl border border-[#16A34A] bg-white px-6 py-10 text-center">
      <div className="text-lg font-semibold text-[#16A34A]">{title}</div>
      {description ? (
        <div className="mt-2 max-w-md text-sm leading-6 text-[#065F46]">
          {description}
        </div>
      ) : null}
    </div>
  );
}

