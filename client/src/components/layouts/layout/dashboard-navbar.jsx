import { useLocation, Link } from "react-router-dom";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@material-tailwind/react";
import { Sidenav } from "/src/components/layouts/layout";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  BellIcon,
  ClockIcon,
  CreditCardIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import { Dialog } from "primereact/dialog";
import { Sidebar } from "primereact/sidebar";

import { useState } from "react";
import {
  useMaterialTailwindController,
  setOpenConfigurator,
  setOpenSidenav,
} from "@/components/context";
import { useAuth } from "@/components/auth/AuthContext";

// Import ThemeToggle component
import ThemeToggle from "@/components/ThemeToggle"; // Adjust path if necessary
import { Image } from "primereact/image";
export function DashboardNavbar({ routegiven }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");
  const { logout } = useAuth(); // Destructure the logout function from useAuth
  const [topDialog, settopDialog] = useState(false);
  const [sidebar, setsidebar] = useState(false);
  const [position, setPosition] = useState("center");

  return (
    <div className=" w-full ">
      <div className="hidden md:block">
        <div className="w-full capitalize ">
          <div className="w-full items-center flex justify-between mb-4">
            <div className="flex flex-row items-center">
              <div className="h-10 mx-3">
                <img
                  src="/img/content-creation.png"
                  alt=""
                  className="h-full aspect-square"
                />
              </div>
              <Breadcrumbs
                className={`bg-transparent p-0 transition-all text-lg ${
                  fixedNavbar ? "mt-1" : ""
                }`}
              >
                <Link to={`/${layout}`}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal transition-all opacity-50 hover:text-blue-500 hover:opacity-100 text-primarytext dark:text-primarytext-dark"
                  >
                    {layout}
                  </Typography>
                </Link>
                {page && (
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal text-primarytext dark:text-primarytext-dark"
                  >
                    {page}
                  </Typography>
                )}
              </Breadcrumbs>
            </div>
            <div className="flex items-center">
              <div className="mr-auto md:mr-4 md:w-56">
                <Input label="Search" />
              </div>

              {/* Theme Toggle Button - Integrated cleanly into the navbar */}
              <ThemeToggle />
              <div className="block">
                <Menu>
                  <MenuHandler>
                    <IconButton variant="text" color="blue-gray">
                      <BellIcon className="w-5 h-5 text-blue-gray-500" />
                    </IconButton>
                  </MenuHandler>
                </Menu>
              </div>
              <Button
                variant="text"
                color="blue-gray"
                className="items-center gap-1 px-4 normal-case xl:flex"
                onClick={logout}
              >
                <UserCircleIcon className="w-5 h-5 text-blue-gray-500" />
                Log out
              </Button>
            </div>
          </div>
          <Sidenav routes={routegiven} />
        </div>
      </div>
      <div className="block md:hidden">
        <Dialog
          header="Search"
          visible={topDialog}
          position="top"
          style={{ width: "95vw" }}
          onHide={() => {
            if (!topDialog) return;
            settopDialog(false);
          }}
          draggable={false}
          resizable={false}
        >
          <div className="mr-auto pt-1 md:mr-4 md:w-56">
            <Input label="Search" />
          </div>
        </Dialog>
        <Sidebar
          visible={sidebar}
          position="right"
          header="Menu"
          onHide={() => setsidebar(false)}
          className="bg-white dark:bg-gray-800 text-primarytext dark:text-primarytext-dark"
        >
          <div className="flex flex-col gap-4">
            <Button
              variant="text"
              className="items-center text-primarytext dark:text-primarytext-dark gap-1 px-4 normal-case xl:flex"
              onClick={logout}
            >
              <UserCircleIcon className="w-5 h-5 text-blue-gray-500" />
              Log out
            </Button>

            {/* Theme Toggle Button - Integrated cleanly into the navbar */}
            <ThemeToggle />
          </div>
        </Sidebar>

        <div className="flex justify-between  items-center flex-col">
          <div className="flex justify-between w-full mb-2">
            <div className="items-center w-full capitalize flex flex-row">
              <div className="h-8 mr-3">
                <img
                  src="/img/content-creation.png"
                  alt=""
                  className="h-full aspect-square"
                />
              </div>
              <Breadcrumbs
                className={`bg-transparent p-0 transition-all ${
                  fixedNavbar ? "mt-1" : ""
                }`}
              >
                <Link to={`/${layout}`}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal transition-all opacity-50 hover:text-blue-500 hover:opacity-100 text-primarytext dark:text-primarytext-dark"
                  >
                    {layout}
                  </Typography>
                </Link>
                {page && (
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal text-primarytext dark:text-primarytext-dark"
                  >
                    {page}
                  </Typography>
                )}
              </Breadcrumbs>
            </div>
            <div className="flex items-center">
              <button onClick={() => settopDialog(true)}>
                <svg
                  className="h-6 w-6 text-gray-500"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.553 15.553a7.06 7.06 0 1 0-9.985-9.985a7.06 7.06 0 0 0 9.985 9.985m0 0L20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                </svg>
              </button>
              <IconButton
                variant="text"
                color="blue-gray"
                className="grid xl:hidden"
                onClick={() => setsidebar(true)}
              >
                <Bars3Icon
                  strokeWidth={3}
                  className="w-6 h-6 text-blue-gray-500"
                />
              </IconButton>
            </div>
          </div>
          <div className="w-full">
            <Sidenav routes={routegiven} />
          </div>
        </div>
      </div>
    </div>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
