import React, { useState, useEffect } from "react";
import { Checkbox, Button, Typography } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthContext";
import AuthService from "@/services/api/auth";
import { signInWithPopup, auth, provider } from "@/firebase";
import { motion } from "framer-motion";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";

export function SignIn() {
  const { login, userRole } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = async (event) => {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const response = await AuthService.loginUser({ email, password });
      if (response.msg === "Logged in successfully!") {
        login(response.token);
        const role = userRole() || "user";
        if (role === "admin") {
          navigate("/admin/");
        } else {
          navigate("/dashboard/Explore");
        }
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch (err) {
      setError(
        err.response?.data?.msg ||
          err.response?.data?.error ||
          "An error occurred during sign-in. Please try again."
      );
      console.error(err);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await AuthService.googleLogin({
        email: user.email,
        name: user.displayName,
      }).then((response) => {
        login(response.token);
        const role = userRole() || "user";
        if (role === "admin") {
          navigate("/admin/");
        } else {
          navigate("/dashboard/Explore");
        }
      });
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Left Side - Gradient background with rotating quotes */}
      <div
        className="relative hidden w-1/2 flex-col justify-center bg-cover bg-center px-24 md:flex bg-blend-screen"
        style={{ backgroundImage: "url('/img/852.jpg')" }}
      >
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4 dark:text-white">
          Welcome back.
          <br />
          <span className="text-indigo-600 dark:text-indigo-400">
            Let’s keep writing.
          </span>
        </h1>
        <p className="text-lg text-gray-600 mb-10 dark:text-gray-300">
          Sign in to continue your stories, track growth, and connect with
          readers.
        </p>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-full bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-300">
              <svg
                className="h-5 w-5"
                viewBox="0 0 50 50"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                >
                  <path
                    d="m18.75 22.917l4.167 4.166l8.333-8.333"
                    stroke="#344054"
                  />
                  <path
                    d="m25 43.75l1.833-.792a22.92 22.92 0 0 0 13.813-19.291l.896-11.5a2.08 2.08 0 0 0-1.584-2.084L25 6.25L10.042 10a2.08 2.08 0 0 0-1.584 2.083l.896 11.5a22.92 22.92 0 0 0 13.813 19.292z"
                    stroke="#306CFE"
                  />
                </g>
              </svg>
            </span>
            <span className="text-gray-700 font-medium dark:text-gray-200">
              Secure authentication
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="p-2 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5V4H2v16h5m10 0v-6H7v6h10z"
                />
              </svg>
            </span>
            <span className="text-gray-700 font-medium dark:text-gray-200">
              No password sharing
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="p-2 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300">
              <svg
                className="h-5 w-5"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M24 4c-5.5 0-10 4.5-10 10v4h4v-4c0-3.3 2.7-6 6-6s6 2.7 6 6v4h4v-4c0-5.5-4.5-10-10-10z"
                  fill="#424242"
                />
                <path
                  d="M36 44H12c-2.2 0-4-1.8-4-4V22c0-2.2 1.8-4 4-4h24c2.2 0 4 1.8 4 4v18c0 2.2-1.8 4-4 4z"
                  fill="#FB8C00"
                />
                <circle cx="24" cy="31" fill="#EFEBE9" r="6" />
                <circle cx="24" cy="31" fill="#1E88E5" r="3" />
                <circle cx="26" cy="29" fill="#fff" r="1" />
              </svg>
            </span>
            <span className="text-gray-700 font-medium dark:text-gray-200">
              Privacy-first
            </span>
          </div>
        </div>
      </div>

      {/* Right Side - Sign In Form */}
      <div className="flex w-full items-center justify-center md:w-1/2">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md p-8 bg-white shadow-lg rounded-xl dark:bg-gray-800"
        >
          <div className="mb-8 text-center">
            <Typography
              variant="h2"
              className="mb-2 font-extrabold text-gray-800 dark:text-white"
            >
              Sign In
            </Typography>
            <Typography
              variant="paragraph"
              className="text-gray-600 dark:text-gray-400"
            >
              Enter your email and password to sign in.
            </Typography>
          </div>

          <form onSubmit={handleSignIn} className="space-y-6">
            <FloatLabel>
              <InputText
                id="email"
                value={email}
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:focus:border-indigo-400"
              />
              <label htmlFor="email" className="dark:text-gray-300">
                Email
              </label>
            </FloatLabel>

            <FloatLabel>
              <InputText
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:focus:border-indigo-400"
              />
              <label htmlFor="password" className="dark:text-gray-300">
                Password
              </label>
            </FloatLabel>

            {error && (
              <Typography
                variant="small"
                color="red"
                className="text-center font-medium"
              >
                {error}
              </Typography>
            )}

            <div className="flex items-center justify-between text-sm">
              <Checkbox
                label={
                  <Typography
                    variant="small"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    I agree to the{" "}
                    <a
                      href="#"
                      className="text-indigo-600 underline dark:text-indigo-400"
                    >
                      Terms and Conditions
                    </a>
                  </Typography>
                }
                containerProps={{ className: "-ml-2.5" }}
              />
              <button
                type="button"
                onClick={() => navigate("/auth/forgot-password")}
                className="text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Forgot Password?
              </button>
            </div>

            <Button
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
              type="submit"
            >
              Sign In
            </Button>

            <Button
              color="white"
              className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
              onClick={loginWithGoogle}
            >
              {/* Google Icon */}
              <svg width="18" height="18" viewBox="0 0 17 16" fill="none">
                <path
                  d="M16.3442 8.18429C16.3442 7.64047 16.3001 7.09371 16.206 6.55872H8.66016V9.63937H12.9813C12.802 10.6329 12.2258 11.5119 11.3822 12.0704V14.0693H13.9602C15.4741 12.6759 16.3442 10.6182 16.3442 8.18429Z"
                  fill="#4285F4"
                />
                <path
                  d="M8.65974 16.0006C10.8174 16.0006 12.637 15.2922 13.9627 14.0693L11.3847 12.0704C10.6675 12.5584 9.7415 12.8347 8.66268 12.8347C6.5756 12.8347 4.80598 11.4266 4.17104 9.53357H1.51074V11.5942C2.86882 14.2956 5.63494 16.0006 8.65974 16.0006Z"
                  fill="#34A853"
                />
                <path
                  d="M4.16852 9.53356C3.83341 8.53999 3.83341 7.46411 4.16852 6.47054V4.40991H1.51116C0.376489 6.67043 0.376489 9.33367 1.51116 11.5942L4.16852 9.53356Z"
                  fill="#FBBC04"
                />
                <path
                  d="M8.65974 3.16644C9.80029 3.1488 10.9026 3.57798 11.7286 4.36578L14.0127 2.08174C12.5664 0.72367 10.6469 -0.0229773 8.65974 0.000539111C5.63494 0.000539111 2.86882 1.70548 1.51074 4.40987L4.1681 6.4705C4.8001 4.57449 6.57266 3.16644 8.65974 3.16644Z"
                  fill="#EA4335"
                />
              </svg>
              <span>Sign in with Google</span>
            </Button>

            <Typography
              variant="small"
              className="text-center text-gray-600 dark:text-gray-400"
            >
              Don’t have an account?{" "}
              <Link
                to="/auth/sign-up"
                className="text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Sign Up
              </Link>
            </Typography>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default SignIn;
