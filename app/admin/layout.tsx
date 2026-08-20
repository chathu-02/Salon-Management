import Link from "next/link";
import { Calendar, Scissors, Box, LayoutDashboard } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 h-[calc(100vh-4rem)] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col h-full shrink-0">
        <div className="p-6">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
            Dashboard
          </h2>
          <nav className="space-y-2">
            <Link 
              href="/admin/appointments"
              className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors hover:bg-secondary hover:text-primary"
            >
              <Calendar className="w-5 h-5" />
              <span>Appointments</span>
            </Link>
            <Link 
              href="/admin/services"
              className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors hover:bg-secondary hover:text-primary"
            >
              <Scissors className="w-5 h-5" />
              <span>Services</span>
            </Link>
            <Link 
              href="/admin/inventory"
              className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors hover:bg-secondary hover:text-primary"
            >
              <Box className="w-5 h-5" />
              <span>Inventory</span>
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background p-6 md:p-8">
        <div className="max-w-6xl mx-auto h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
