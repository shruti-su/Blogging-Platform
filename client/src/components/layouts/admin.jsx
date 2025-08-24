import { Routes, Route } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";

import {
  Sidenav,
  DashboardNavbar,
  Footer,
} from "/src/components/layouts/layout";

import routes from "/src/router.jsx";

export function AdminPanel() {
  // Filter out only admin routes
  const adminRoutes = routes.find((r) => r.layout === "admin")?.pages || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-3xl">
      {/* Sidebar for admin routes */}
      <Sidenav routes={[{ layout: "admin", pages: adminRoutes }]} />

      {/* Main content layout */}
      <div className="grid min-h-screen p-4 xl:ml-80 grid-rows-12">
        {/* Top navbar and floating config button */}

        {/* Main route content */}
        <div className="overflow-auto row-span-10">
          <Routes>
            {adminRoutes.map(({ path, element }, index) => (
              <Route key={index} path={path} element={element} />
            ))}

            {/* Optional fallback route */}
            {/* <Route path="*" element={<p>Page Not Found</p>} /> */}
          </Routes>
        </div>

        {/* Footer */}
        <div className="row-span-1 text-blue-gray-600">
          <Footer />
        </div>
      </div>
    </div>
  );
}

AdminPanel.displayName = "/src/components/layouts/AdminPanel.jsx";

export default AdminPanel;
