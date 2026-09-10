import { Outlet } from "react-router-dom";

import Header from "./Header";
import Sidebar from "./Sidebar";

function Layout() {
  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <Sidebar />

      <main className="ml-60 mt-[70px] min-h-[calc(100vh-70px)] p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;