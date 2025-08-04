import { Routes, Route } from "react-router-dom";

import { Navbar, Footer } from "/src/components/layouts/layout";
import routes from "/src/router.jsx";

export function Auth() {
  

  return (
    <div className="relative w-full min-h-screen">
      <Routes>
        {routes.map(
          ({ layout, pages }) =>
            layout === "auth" &&
            pages.map(({ path, element }) => (
              <Route exact path={path} element={element} />
            ))
        )}
      </Routes>
    </div>
  );
}

Auth.displayName = "/src/layout/Auth.jsx";

export default Auth;
