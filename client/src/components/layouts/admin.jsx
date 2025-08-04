import { Routes, Route } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";

import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  Footer,
} from "/src/components/layouts/layout";

import {
  useMaterialTailwindController,
  setOpenConfigurator,
} from "/src/components/context";

import routes from "/src/router.jsx";

export function AdminPanel() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;

  // Filter out only admin routes
  const adminRoutes = routes.find((r) => r.layout === "admin")?.pages || [];

  return (
    <div className="bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-3xl min-h-screen">
      {/* Sidebar for admin routes */}
      <Sidenav
        routes={[{ layout: "admin", pages: adminRoutes }]}
        brandImg={
          sidenavType === "dark"
            ? "/img/logo-ct.png"
            : "/img/logo-ct-dark.png"
        }
      />

      {/* Main content layout */}
      <div className="p-4 xl:ml-80 min-h-screen grid grid-rows-12">
        {/* Top navbar and floating config button */}
        <div className="row-span-1">
          <DashboardNavbar />
          <Configurator />

          <IconButton
            size="lg"
            color="white"
            className="fixed z-40 rounded-full bottom-8 right-8 shadow-blue-gray-900/10"
            ripple={false}
            onClick={() => setOpenConfigurator(dispatch, true)}
          >
            <Cog6ToothIcon className="w-5 h-5" />
          </IconButton>
        </div>

        {/* Main route content */}
        <div className="row-span-10 overflow-auto">
          <Routes>
            {adminRoutes.map(({ path, element }, index) => (
              <Route key={index} path={path} element={element} />
            ))}

            {/* Optional fallback route */}
            {/* <Route path="*" element={<p>Page Not Found</p>} /> */}
          </Routes>
        </div>

        {/* Footer */}
        <div className="text-blue-gray-600 row-span-1">
          <Footer />
        </div>
      </div>
    </div>
  );
}

AdminPanel.displayName = "/src/components/layouts/AdminPanel.jsx";

export default AdminPanel;
