import { createBrowserRouter } from "react-router";
import RootLayout from "@/layouts/Layout.tsx";
import Dashboard from "./pages/Dashboard";
import ProjectsPage from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";

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
        children: [
          {
            index: true,
            Component: ProjectsPage,
          },
          {
            path: ":projectId",
            Component: ProjectDetails,
          },
        ],
      },
    ],
  },
]);

export default router;
