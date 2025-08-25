import React from "react";
import { NavLink } from "react-router-dom";
import { Typography } from "@material-tailwind/react";

export function Sidenav({ routes }) {
  return (
    <div>
      {routes.map(({ layout, pages }) => (
        <div key={layout} className="flex flex-row gap-1 ">
          {/* Filter pages to only show those with sidebar: true */}
          {pages
            .filter((page) => page.sidebar === true)
            .map(({ icon, name, path }) => (
              <div key={name}>
                <NavLink to={`/${layout}${path}`}>
                  {({ isActive }) => (
                    <button
                      className={`flex items-center gap-4 px-4 capitalize ${
                        isActive
                          ? " text-gray-900 dark:text-gray-200 border-b-4 border-blue-500"
                          : "text-gray-900 dark:text-gray-200"
                      }`}
                    >
                      {icon}
                      <Typography
                        color="inherit"
                        className="font-medium capitalize"
                      >
                        {name}
                      </Typography>
                    </button>
                  )}
                </NavLink>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}

Sidenav.displayName = "/src/widgets/layout/sidenav.jsx";

export default Sidenav;
