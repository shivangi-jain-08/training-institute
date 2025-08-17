import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-950 transition-colors duration-300">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex min-h-full">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 p-6 lg:pl-6 transition-all duration-300">
          <div className="max-w-7xl mx-auto animate-in">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
