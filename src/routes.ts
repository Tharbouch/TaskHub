import { createBrowserRouter } from "react-router";
import RootLayout from "@/layouts/Layout.tsx";
import Dashboard from "./pages/Dashboard";
import ProjectsPage from "./pages/Projects";

const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Dashboard,
      },
      {
        path: "/projects",
        Component: ProjectsPage,
      },
    ],
  },
]);

export default router;
