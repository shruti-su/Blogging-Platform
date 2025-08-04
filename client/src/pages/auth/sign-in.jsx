import React, { useState, useEffect } from "react";
import {
  Card, // Keep Card for other elements if needed, though not for the main form wrapper here
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthContext"; // Adjust the import path as necessary
import AuthService from "@/services/api/auth"; // Import the AuthService for API calls
import { signInWithPopup, auth, provider } from "@/firebase";
import { motion } from "framer-motion"; // Import Framer Motion
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';
import { Password } from 'primereact/password';

export function SignIn() {
  const { login, userRole } = useAuth(); // Destructure the login function from useAuth
  const navigate = useNavigate(); // Hook to programmatically navigate
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State for displaying error messages

  // Framer Motion variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Stagger children animations
        delayChildren: 0.2, // Delay before children start animating
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 }, // Start slightly lower and invisible
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring", // Spring animation for a smooth pop-in
        stiffness: 100,
        damping: 15,
      },
    },
  };

  // Function to handle the sign-in process
  const handleSignIn = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    setError(""); // Clear any previous errors

    // Basic client-side validation
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const response = await AuthService.loginUser({ email, password });

      // Check simulated credentials
      if (response.msg === "Logged in successfully!") {
        login(response.token); // Call the login function from AuthContext to update global state
        // 👉 Redirect based on role
        const role = userRole() || "user"; // fallback to 'user' if undefined
        if (role === "admin") {
          navigate("/admin/home");
        } else {
          navigate("/dashboard/home");
        }
      } else {
        // If simulated credentials don't match, set an error
        setError("Invalid email or password. Please try again.");
      }
    } catch (err) {
      // Catch any network errors or issues with the API call
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
      // console.log("Logged in user:", user);
      await AuthService.googleLogin({
        email: user.email,
        name: user.displayName,
      }).then((response) => {
        login(response.token);
        const role = userRole() || "user"; // fallback to 'user' if undefined
        if (role === "admin") {
          navigate("/admin/home");
        } else {
          navigate("/dashboard/home");
        }
      });

    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <motion.section
      className="flex flex-col items-center justify-center min-h-screen py-8 px-4 bg-[url('/img/sl_122221_47450_06.jpg')] bg-cover bg-center" // Background image applied here
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        variants={itemVariants}
        className="w-full max-w-md lg:max-w-lg rounded-xl overflow-hidden shadow-2xl shadow-blue-200" // Main container for image and form
      >

        <div className="p-6 md:p-8 bg-white rounded-b-xl">
          {" "}
          {/* Form container */}
          <div className="text-center mb-8">
            <motion.div variants={itemVariants}>
              <Typography
                variant="h2"
                className="mb-2 font-extrabold text-gray-800"
              >
                Sign In
              </Typography>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Typography
                variant="paragraph"
                color="blue-gray"
                className="text-lg font-normal text-gray-600"
              >
                Enter your email and password to sign in.
              </Typography>
            </motion.div>
          </div>
          <form className="w-full mx-auto" onSubmit={handleSignIn}>
            {" "}
            {/* Removed max-w-screen-lg from form */}
            <div className="flex flex-col gap-6 mb-4">
              <motion.div variants={itemVariants}>
                <div className="relative w-full">
                  <FloatLabel>
                    <InputText
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-indigo-500"
                    />
                    <label htmlFor="email">Your email</label>
                  </FloatLabel>
                </div>
              </motion.div>
              <motion.div variants={itemVariants}>
                <div className="relative w-full">
                  <FloatLabel>
                    <InputText
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-indigo-500"
                    />
                    <label htmlFor="password">Password</label>
                  </FloatLabel>
                </div>
              </motion.div>
            </div>
            {/* Display error message if any */}
            {error && (
              <motion.div variants={itemVariants}>
                <Typography
                  variant="small"
                  color="red"
                  className="mb-4 text-center font-medium"
                >
                  {error}
                </Typography>
              </motion.div>
            )}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
              <motion.div variants={itemVariants}>
                <Checkbox
                  label={
                    <Typography
                      variant="small"
                      color="gray"
                      className="flex items-center justify-start font-medium text-gray-700"
                    >
                      I agree the&nbsp;
                      <a
                        href="#"
                        className="font-normal text-indigo-600 underline transition-colors hover:text-indigo-800"
                      >
                        Terms and Conditions
                      </a>
                    </Typography>
                  }
                  containerProps={{ className: "-ml-2.5" }}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <Typography
                  variant="small"
                  className="font-medium text-gray-900"
                >
                  <a href="#" className="text-indigo-600 hover:text-indigo-800" onClick={() => navigate("/auth/forgot-password")}>
                    Forgot Password
                  </a>
                </Typography>
              </motion.div>
            </div>
            <motion.div variants={itemVariants}>
              <Button
                className="mt-6 bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg transform hover:scale-[1.01] transition-all duration-200 text-white"
                fullWidth
                type="submit"
              >
                Sign In
              </Button>
            </motion.div>
            <motion.div variants={itemVariants} className="mt-8 space-y-4">
              <Button
                size="lg"
                color="white"
                className="flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-[1.01] transition-all duration-200 text-gray-700 border border-blue-gray-200 bg-white hover:bg-gray-50"
                fullWidth
                onClick={loginWithGoogle}
              >
                <svg
                  width="17"
                  height="16"
                  viewBox="0 0 17 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_1156_824)">
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
                  </g>
                  <defs>
                    <clipPath id="clip0_1156_824">
                      <rect
                        width="16"
                        height="16"
                        fill="white"
                        transform="translate(0.5)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                <span>Sign in With Google</span>
              </Button>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Typography
                variant="paragraph"
                className="mt-4 font-medium text-center text-blue-gray-500"
              >
                Not registered?
                <Link
                  to="/auth/sign-up"
                  className="ml-1 text-indigo-600 hover:text-indigo-800"
                >
                  Create account
                </Link>
              </Typography>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </motion.section>
  );
}

export default SignIn;
