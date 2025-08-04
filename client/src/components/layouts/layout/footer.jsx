import PropTypes from "prop-types";
import { Typography } from "@material-tailwind/react";
import { HeartIcon } from "@heroicons/react/24/solid";

export function Footer({ brandName, brandLink, routes }) {
  const year = new Date().getFullYear();

  return (
    <footer className="py-2 text-center">
      {/* <ul className="flex items-center gap-4">
          {routes.map(({ name, path }) => (
            <li key={name}>
              <Typography
                as="a"
                href={path}
                target="_blank"
                variant="small"
                className="py-0.5 px-1 font-normal text-inherit transition-colors hover:text-blue-500"
              >
                {name}
              </Typography>
            </li>
          ))}
        </ul> */}
      <span className="font-bold text-indigo-600 text-lg">
        Excel Analytics Dashboard
      </span>{" "}
      &copy; {new Date().getFullYear()}
      <br />
      <span className="text-gray-500">
        Made with <span className="text-pink-500">♥</span> by Shruti
      </span>
    </footer>
  );
}

// Footer.defaultProps = {
//   brandName: "Creative Tim",
//   brandLink: "https://www.creative-tim.com",
//   routes: [
//     { name: "Creative Tim", path: "https://www.creative-tim.com" },
//     { name: "About Us", path: "https://www.creative-tim.com/presentation" },
//     { name: "Blog", path: "https://www.creative-tim.com/blog" },
//     { name: "License", path: "https://www.creative-tim.com/license" },
//   ],
// };

// Footer.propTypes = {
//   brandName: PropTypes.string,
//   brandLink: PropTypes.string,
//   routes: PropTypes.arrayOf(PropTypes.object),
// };

// Footer.displayName = "/src/widgets/layout/footer.jsx";

export default Footer;
