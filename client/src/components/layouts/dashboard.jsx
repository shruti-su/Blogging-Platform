import { Routes, Route } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import {
  Sidenav,
  DashboardNavbar,
  Footer,
} from "/src/components/layouts/layout";

import routes from "/src/router.jsx";

export function Dashboard() {
  // Debugging: Check the routes array structure and content
  // console.log("Dashboard: `routes` prop:", routes);

  return (
    <div className="min-h-screen bg-secondary dark:bg-secondary-dark ">
      {/* Sidenav component should receive the full routes or filtered ones for navigation */}

      <div className="grid p-4 ">
        <div className="p-4 mb-4 shadow-lg bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-blue-gray-500/5">
          <DashboardNavbar />
          <Sidenav
            routes={routes.filter((r) => r.layout === "dashboard")} // Pass only dashboard routes to Sidenav
          />
        </div>
        <div>
          <Routes>
            {routes.map(({ layout, pages }) => {
              if (layout === "dashboard") {
                return pages.map(({ path, element }, key) => (
                  <Route key={key} path={path} element={element} />
                ));
              }
              return null; // Don't render anything for non-dashboard layouts
            })}
            {/* <Route path="/" element={<Navigate to="/home" replace />} /> */}
            {/* <Route path="*" element={<p>Dashboard Page Not Found (404)</p>} /> */}
          </Routes>
        </div>

        {/* <div className="row-span-1 text-blue-gray-600">
          <Footer />
        </div> */}
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/components/layout/dashboard.jsx";

export default Dashboard;
