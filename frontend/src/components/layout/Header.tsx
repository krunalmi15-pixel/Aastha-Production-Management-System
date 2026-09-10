import { Building2, UserCircle2 } from "lucide-react";

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[70px] border-b bg-white shadow-sm">
      <div className="flex h-full items-center justify-between px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Building2 className="h-6 w-6" />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Aastha Engineering
            </h1>

            <p className="text-sm text-slate-500">
              Production Management System
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border bg-slate-50 px-4 py-2">
          <UserCircle2 className="h-8 w-8 text-slate-600" />

          <div className="text-right">
            <p className="text-sm font-semibold text-slate-900">
              Administrator
            </p>

            <p className="text-xs text-slate-500">
              System Admin
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;