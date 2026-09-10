import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Boxes,
  Package,
  Users,
  Cpu,
  FileBarChart2,
  Settings,
} from "lucide-react";

const menu = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    title: "Lots",
    icon: Boxes,
    path: "/lots",
  },
  {
    title: "Item Master",
    icon: Package,
    path: "/items",
  },
  {
    title: "Employee Master",
    icon: Users,
    path: "/employees",
  },
  {
    title: "Machine Master",
    icon: Cpu,
    path: "/machines",
  },
  {
    title: "Reports",
    icon: FileBarChart2,
    path: "/reports",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

function Sidebar() {
  return (
    <aside className="fixed left-0 top-[70px] h-[calc(100vh-70px)] w-60 border-r bg-background">
      <div className="p-4">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Navigation
        </p>

        <nav className="space-y-1">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`
                }
              >
                <Icon className="h-5 w-5" />

                <span>{item.title}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;