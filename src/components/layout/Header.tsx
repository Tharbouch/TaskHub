import { NavLink } from "react-router";
import { ListChecks, Sun, Moon, Menu } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

type HeaderProps = {
  toggleSidebar: () => void;
};

export default function Header({ toggleSidebar }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="bg-white dark:bg-gray-700 shadow-lg w-full px-4 sm:px-6 lg:px-8 py-2">
      <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
        <div className="flex items-center space-x-2">
          <NavLink to="/" className="flex items-center space-x-2">
            <ListChecks />
            <h1 className="text-2xl font-bold">Task Hub</h1>
          </NavLink>
        </div>
        <div className="flex items-center p-2 space-x-4">
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${
              theme === "light" ? "dark" : "light"
            } theme`}
          >
            {theme === "light" ? (
              <Moon size={30} className="text-gray-800" />
            ) : (
              <Sun size={30} className="text-yellow-500" />
            )}
          </button>
          {/* Sidebar toggle button displayed only on small screens */}
          <button
            className="lg:hidden mr-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}
