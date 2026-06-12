import Navbar from "@/app/components/layout/Navbar";
import Sidebar from "@/app/components/layout/Sidebar";
import Footer from "@/app/components/layout/Footer";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <Navbar />
      <div className="mx-auto flex max-w-6xl">
        <Sidebar />
        <main className="min-w-0 flex-1 px-4 py-8 md:px-6">{children}</main>
      </div>
      <Footer />
    </div>
  );
}

