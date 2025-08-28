import React from "react";
import { NavLink } from "react-router-dom";
import { Typography } from "@material-tailwind/react";

export function Sidenav({ routes }) {
  return (
    <div className="">
      {routes.map(({ layout, pages }) => (
        <div
          key={layout}
          className="flex flex-row gap-1 justify-between md:justify-start"
        >
          {/* Filter pages to only show those with sidebar: true */}
          {pages
            .filter((page) => page.sidebar === true)
            .map(({ icon, name, path }) => (
              <div key={name}>
                <NavLink to={`/${layout}${path}`}>
                  {({ isActive }) => (
                    <button
                      className={`flex items-center md:gap-2 md:mx-2  px-1 capitalize ${
                        isActive
                          ? `text-gray-900 dark:text-gray-200
                            bg-blue-400 px-2 py-1
                            rounded-lg  md:border-b-4 md:border-blue-500
                            md:rounded-none  md:py-0 
                            md:bg-transparent `
                          : "text-gray-900 dark:text-gray-200  px-2 py-1 md:py-0   "
                      }`}
                    >
                      {icon}
                      <Typography
                        color="inherit"
                        className="font-medium capitalize hidden md:inline-block"
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
