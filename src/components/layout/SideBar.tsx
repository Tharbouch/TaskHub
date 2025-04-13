import { useEffect } from "react";
import { Home, Layers } from "lucide-react";
import { NavLink } from "react-router";

type SideBarProps = {
  isOpen: boolean;
  toggleSidebar: () => void;
};

export default function SideBar({ isOpen, toggleSidebar }: SideBarProps) {
  // Adjust the sidebar state when the window is resized.
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024 && !isOpen) {
        toggleSidebar();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, toggleSidebar]);

  return (
    <>
      {/* Overlay for mobile devices when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`min-h-full bg-white dark:bg-gray-900 shadow-lg z-30 transition-transform duration-300 ease-in-out
          lg:w-72 w-64
          lg:static fixed top-0 right-0 bottom-0
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          lg:translate-x-0`}
        role="complementary"
        aria-label="Sidebar"
      >
        <nav
          className="flex flex-col space-y-1 flex-1 p-4 h-full"
          aria-label="Main navigation"
        >
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "flex items-center gap-2 px-4 py-2 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30  text-blue-600 dark:text-blue-400"
                : "flex items-center gap-2 px-4 py-2 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 "
            }
          >
            <Home size={18} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/projects"
            className={({ isActive }) =>
              isActive
                ? "flex items-center gap-2 px-4 py-2 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30  text-blue-600 dark:text-blue-400"
                : "flex items-center gap-2 px-4 py-2 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 "
            }
          >
            <Layers size={18} />
            <span>All Projects</span>
          </NavLink>
        </nav>
      </aside>
    </>
  );
}
