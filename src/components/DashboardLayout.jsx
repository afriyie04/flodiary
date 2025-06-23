import React, { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import MobileHeader from "./MobileHeader";

function DashboardLayout({ children, activePage, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activePage={activePage}
      />

      {/* Main Content */}
      <div className="md:ml-64 flex flex-col min-h-screen">
        <MobileHeader title={title} onMenuClick={() => setSidebarOpen(true)} />

        {/* Main content area */}
        <div className="flex-1 p-4 md:p-8">{children}</div>
      </div>
    </div>
  );
}

export default DashboardLayout;
