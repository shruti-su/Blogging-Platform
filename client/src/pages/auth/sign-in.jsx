import React, { useState } from "react";
import { Checkbox, Button, Typography } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthContext";
import AuthService from "@/services/api/auth";
import { signInWithPopup, auth, provider } from "@/firebase";
import { motion } from "framer-motion";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { MdSecurity, MdLock, MdVerifiedUser } from "react-icons/md"; // Using React Icons for better quality

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
        navigate(role === "admin" ? "/admin/" : "/dashboard/Explore");
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
      let photoURL = user.photoURL;
      if (photoURL && photoURL.includes("googleusercontent.com")) {
        photoURL = photoURL.split("=")[0] + "=s256-c";
      }
      await AuthService.googleLogin({
        email: user.email,
        name: user.displayName,
        photoURL: photoURL,
      }).then((response) => {
        login(response.token);
        const role = userRole() || "user";
        navigate(role === "admin" ? "/admin/" : "/dashboard/Explore");
      });
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Left Side - Background with text */}
      <div
        className="relative hidden w-1/2 mx-8 my-24 flex-col justify-center overflow-hidden rounded-2xl bg-cover bg-center px-16 md:flex"
        style={{
          backgroundImage: "url('/img/3262567.jpg')", // Ensure you have this SVG or a similar one
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="relative z-10 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl font-extrabold text-white leading-tight">
              Welcome back.
              <br />
              <span className="text-indigo-400">Let’s keep writing.</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-md mt-4">
              Sign in to continue your stories, track growth, and connect with
              readers.
            </p>
          </motion.div>

          <div className="space-y-5 mt-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex items-center gap-4"
            >
              <span className="p-3 bg-green-500/20 text-green-400 rounded-full">
                <MdSecurity size={24} />
              </span>
              <span className="font-semibold text-gray-200">
                Secure authentication
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex items-center gap-4"
            >
              <span className="p-3 bg-blue-500/20 text-blue-400 rounded-full">
                <MdLock size={24} />
              </span>
              <span className="font-semibold text-gray-200">
                No password sharing
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex items-center gap-4"
            >
              <span className="p-3 bg-purple-500/20 text-purple-400 rounded-full">
                <MdVerifiedUser size={24} />
              </span>
              <span className="font-semibold text-gray-200">Privacy-first</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right Side - Sign In Form */}
      <div className="flex w-full items-center justify-center md:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-lg p-8 bg-white shadow-lg rounded-2xl dark:bg-gray-800"
        >
          <div className="mb-8 text-center">
            <Typography
              variant="h2"
              className="mb-2 text-4xl font-bold text-gray-900 dark:text-white"
            >
              Sign In
            </Typography>
            <Typography
              variant="paragraph"
              className="text-lg text-gray-600 dark:text-gray-400"
            >
              Enter your credentials to continue
            </Typography>
          </div>

          <form onSubmit={handleSignIn} className="space-y-6">
            {/* Email */}
            <FloatLabel>
              <InputText
                id="email"
                value={email}
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border px-3 py-2 focus:border-indigo-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-indigo-400"
              />
              <label htmlFor="email" className="dark:text-gray-300">
                Email
              </label>
            </FloatLabel>

            {/* Password */}
            <FloatLabel>
              <InputText
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border px-3 py-2 focus:border-indigo-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-indigo-400"
              />
              <label htmlFor="password" className="dark:text-gray-300">
                Password
              </label>
            </FloatLabel>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-center text-sm font-medium text-red-500 bg-red-500/10 p-2 rounded-md"
              >
                {error}
              </motion.div>
            )}

            {/* Options */}
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
                      Terms
                    </a>
                  </Typography>
                }
                containerProps={{ className: "-ml-2.5" }}
              />
              <Link
                to="/auth/forgot-password"
                className="text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Sign In Button */}
            <Button
              className="w-full bg-indigo-600 text-white shadow-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 transition-transform duration-200 hover:scale-[1.01]"
              type="submit"
            >
              Sign In
            </Button>

            {/* Google Button */}
            <Button
              color="white"
              className="w-full flex items-center justify-center gap-3 border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-transform duration-200 hover:scale-[1.01]"
              onClick={loginWithGoogle}
            >
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
              <span className="font-medium">Sign in with Google</span>
            </Button>

            {/* Sign Up Link */}
            <Typography
              variant="small"
              className="text-center text-gray-600 dark:text-gray-400 mt-4"
            >
              Don’t have an account?{" "}
              <Link
                to="/auth/sign-up"
                className="text-indigo-600 hover:underline dark:text-indigo-400 font-medium"
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
