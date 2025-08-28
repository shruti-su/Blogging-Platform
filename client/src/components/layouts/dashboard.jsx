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
  return (
    <div className="min-h-svh w-full bg-secondary dark:bg-secondary-dark ">
      <div className="grid p-4 ">
        <div className="p-4 pb-0  shadow-lg bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-blue-gray-500/5">
          <DashboardNavbar
            routegiven={routes.filter((r) => r.layout === "dashboard")}
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
              return null;
            })}
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
