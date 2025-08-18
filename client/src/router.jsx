import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import Home from "/src/pages/dashboard/home";
import { SignIn, SignUp, Forgotpassword } from "/src/pages/auth";
import Upload from "./pages/dashboard/upload";
import ChooseBlogType from "./pages/dashboard/choose-blogtype";
import Unauthorised from "/src/pages/unauthorised/unauthorised";
import AdminHome from "./pages/admin/AdminHome"; // Adjust the path as needed
import UserManagement from "./pages/admin/user-management"; // Adjust the path as needed

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "Explore",
        path: "/",
        element: <Home />,
        sidebar: true,
      },
      {
        icon: (
          <>
            <svg
              className="w-5 h-5 "
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.71 7.71L11 5.41V15a1 1 0 0 0 2 0V5.41l2.29 2.3a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42l-4-4a1 1 0 0 0-.33-.21a1 1 0 0 0-.76 0a1 1 0 0 0-.33.21l-4 4a1 1 0 1 0 1.42 1.42ZM21 12a1 1 0 0 0-1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6a1 1 0 0 0-2 0v6a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-6a1 1 0 0 0-1-1Z"
                fill="currentColor"
              />
            </svg>
          </>
        ),
        name: "Upload",
        path: "/upload",
        element: <Upload />,
        sidebar: true,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Choose Blog Type",
        path: "/choose-blogtype",
        element: <ChooseBlogType />,
        sidebar: true,
      },
    ],
  },
  {
    layout: "admin",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "Admin Dashboard",
        path: "/",
        element: <AdminHome />,
        sidebar: true,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "User Management",
        path: "/user-management",
        element: <UserManagement />,
        sidebar: true,
      },
    ],
  },
  {
    title: "unauthorised",
    layout: "unauthorised",
    pages: [
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "Unauthorised",
        path: "/",
        element: <Unauthorised />,
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "forgot password",
        path: "/forgot-password",
        element: <Forgotpassword />,
      },
    ],
  },
];

export default routes;
