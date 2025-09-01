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
import UploadBlog from "/src/pages/dashboard/blog/upload-blog";
import CreateBlog from "/src/pages/dashboard/blog/create-blog";
import BlogList from "/src/pages/dashboard/blog/blog-list";
import ChooseBlogType from "/src/pages/dashboard/choose-blogtype";
import CategoryList from "/src/pages/dashboard/category/category-list";
import Unauthorised from "/src/pages/unauthorised/unauthorised";
import AdminHome from "./pages/admin/AdminHome"; // Adjust the path as needed
import UserManagement from "./pages/admin/user-management"; // Adjust the path as needed
import BlogView from "@/pages/dashboard/blog/blog-view";
import BlogEditPage from "@/pages/dashboard/blog/blog-edit";

const icon = {
  className: "w-6 h-6 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "Explore",
        path: "/Explore",
        element: <Home />,
        sidebar: true,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "blog-viewer",
        path: "/blog-viewer/:id",
        element: <BlogView />,
        sidebar: true,
      },
      {
        icon: (
          <>
            <svg
              className="w-6 h-6 "
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
        name: "Upload Blog",
        path: "/upload-blog",
        element: <UploadBlog />,
        sidebar: true,
      },
      {
        icon: (
          <>
            <svg
              className="w-6 h-6"
              viewBox="0 0 576 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z"
                fill="currentColor"
              />
            </svg>
          </>
        ),
        name: "Edit Blog",
        path: "/edit-blog/:id",
        element: <BlogEditPage />,
        sidebar: false,
      },
      {
        icon: (
          <>
            <svg
              className="w-6 h-6"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g fill="none">
                <circle cx="5" cy="6" fill="currentColor" r="1.5" />
                <circle cx="5" cy="10" fill="currentColor" r="1.5" />
                <circle cx="5" cy="14" fill="currentColor" r="1.5" />
                <path
                  d="M8.5 6h7m-7 4h7m-7 4h7"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2"
                />
              </g>
            </svg>
          </>
        ),
        name: "Category List",
        path: "/category-list",
        element: <CategoryList />,
        sidebar: true,
      },

      {
        icon: (
          <>
            <svg
              className="w-6 h-6"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g fill="none">
                <circle cx="5" cy="6" fill="currentColor" r="1.5" />
                <circle cx="5" cy="10" fill="currentColor" r="1.5" />
                <circle cx="5" cy="14" fill="currentColor" r="1.5" />
                <path
                  d="M8.5 6h7m-7 4h7m-7 4h7"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2"
                />
              </g>
            </svg>
          </>
        ),
        name: "Blogs",
        path: "/blog-list",
        element: <BlogList />,
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
