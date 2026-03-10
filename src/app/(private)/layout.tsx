import { Sidebar } from "@/components/layout/Sidebar";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-sand-50">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
