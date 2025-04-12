import { useState, useEffect } from "react";
import { Outlet } from "react-router";
import Header from "../components/layout/Header";
import SideBar from "../components/layout/SideBar";

export default function RootLayout() {
  // On larger screens, we want the sidebar open by default.
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(window.innerWidth > 1024);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <>
      {/* Skip to content link improves keyboard navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only absolute top-0 left-0 bg-white dark:bg-gray-900 text-black dark:text-white p-2 z-50"
      >
        Skip to content
      </a>

      {/* Header now receives a toggle prop for the sidebar */}
      <Header toggleSidebar={toggleSidebar} />

      <div id="main-content" className="flex flex-1 relative min-h-full">
        <SideBar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main content area */}
        <main
          className="flex-1 transition-transform duration-300 overflow-auto p-10 "
          tabIndex={-1}
        >
          <Outlet />
        </main>
      </div>
    </>
  );
}
