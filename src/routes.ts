import { createBrowserRouter } from "react-router";
import RootLayout from "@/layouts/Layout.tsx";
import Dashboard from "./pages/Dashboard";

const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Dashboard,
      },
    ],
  },
]);

export default router;
