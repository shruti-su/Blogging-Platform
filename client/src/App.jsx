import { useState } from "react";
import "./index.css";
// import userService from "./services/userService";
import Unauthorised from "./pages/unauthorised/unauthorised";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Dashboard, Auth, AdminPanel } from "/src/components/layouts";
import { AuthProvider } from "@/components/auth/AuthContext"; // Import your AuthProvider
import ProtectedRoute from "@/components/auth/ProtectedRoute"; // Import your ProtectedRoute component
import General from "./pages/general";
import LandingPage from "./pages/landing-page";
import PageNotFound from "./pages/page-not-found";

function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
          {/* <AuthProvider> */}
          <Route path="*" element={<PageNotFound />} />
          <Route path="/" element={<LandingPage />} />
          <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
            <Route
              path="/dashboard/"
              element={<Navigate to="/dashboard/Explore" replace />}
            />

            <Route path="/dashboard/*" element={<Dashboard />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/*" element={<AdminPanel />} />
            <Route
              path="/admin/"
              element={<Navigate to="/admin/admin-home" replace />}
            />
          </Route>
          <Route path="/unauthorised" element={<Unauthorised />} />
          <Route path="/auth/*" element={<Auth />} />
          {/* <Route path="*" element={<Na0vigate to="/Attendance" replace />} /> */}
          {/* </AuthProvider> */}
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
