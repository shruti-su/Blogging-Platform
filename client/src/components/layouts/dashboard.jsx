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

export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;

  // Debugging: Check the routes array structure and content
  // console.log("Dashboard: `routes` prop:", routes);

  return (
    <div className="bg-secondary dark:bg-secondary-dark">
      {/* Sidenav component should receive the full routes or filtered ones for navigation */}
      <Sidenav
        routes={routes.filter((r) => r.layout === "dashboard")} // Pass only dashboard routes to Sidenav
      />
      <div className="grid h-screen p-4 overflow-hidden xl:ml-56 grid-rows-12 ">
        <div className="row-span-1 overflow-hidden">
          <DashboardNavbar />
          {/* <Configurator /> */}
          {/* <IconButton
            size="lg"
            color="white"
            className="fixed z-40 rounded-full bottom-8 right-8 shadow-blue-gray-900/10"
            ripple={false}
            onClick={() => setOpenConfigurator(dispatch, true)}
          >
            <Cog6ToothIcon className="w-5 h-5" />
          </IconButton> */}
        </div>
        <div className="overflow-auto row-span-11 ">
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
