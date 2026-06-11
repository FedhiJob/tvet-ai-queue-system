import Link from "next/link";
import RequestFormCard from "@/app/components/request-form-card";

export const metadata = {
  title: "Create Registrar Request",
};

export default function NewRequestPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <nav className="text-sm text-slate-600" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li>
              <Link className="text-blue-600 hover:underline" href="/">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-slate-900">Requests</li>
            <li aria-hidden="true">/</li>
            <li className="text-slate-900">New</li>
          </ol>
        </nav>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
          Create Registrar Request
        </h1>
        <p className="mt-1 text-slate-600">
          Submit your request. Our system will classify priority and estimate your wait time.
        </p>
      </div>

      <RequestFormCard />
    </div>
  );
}


