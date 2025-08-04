import React, { useState } from "react";
import {
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthContext";
import AuthService from "@/services/api/auth";
import { signInWithPopup, auth, provider } from "@/firebase";
import { motion } from "framer-motion";
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';
import { Password } from 'primereact/password';

export function SignUp() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const response = await AuthService.googleLogin({
        email: user.email,
        name: user.displayName,
      });
      login(response.token);
      navigate("/dashboard/home");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    try {
      const response = await AuthService.signUpUser({ name, email, password });
      if (response.error || response.warning) {
        setError(response.error || response.warning || "Signup failed");
      } else {
        setSuccess("Registration successful! Please sign in.");
        login(response.token);
        navigate("/dashboard/home");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <motion.section
      className="flex flex-col items-center justify-center min-h-screen py-8 px-4 bg-[url('/img/sl_122221_47450_06.jpg')] bg-cover bg-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        variants={itemVariants}
        className="w-full max-w-md lg:max-w-lg rounded-xl overflow-hidden shadow-2xl shadow-blue-200 bg-white p-6 md:p-8"
      >
        <div className="text-center mb-8">
          <motion.div variants={itemVariants}>
            <Typography variant="h2" className="mb-2 font-extrabold text-gray-800">
              Create an Account
            </Typography>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal text-gray-600">
              Enter your details to register.
            </Typography>
          </motion.div>
        </div>
        <form className="w-full mx-auto" onSubmit={handleSignUp}>
          <div className="flex flex-col gap-6 mb-4">
            <motion.div variants={itemVariants}>
              <FloatLabel>
                <InputText
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-indigo-500"
                />
                <label htmlFor="name">Your Name</label>
              </FloatLabel>
            </motion.div>

            <motion.div variants={itemVariants}>
              <FloatLabel>
                <InputText
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-indigo-500"
                />
                <label htmlFor="email">Your Email</label>
              </FloatLabel>
            </motion.div>

            <motion.div variants={itemVariants}>
              <FloatLabel>
                <Password
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                  inputClassName="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-indigo-500"
                  feedback={false}
                />
                <label htmlFor="password">Password</label>
              </FloatLabel>
            </motion.div>

            <motion.div variants={itemVariants}>
              <FloatLabel>
                <Password
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full"
                  inputClassName="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-indigo-500"
                  feedback={false}
                />
                <label htmlFor="confirm-password">Confirm Password</label>
              </FloatLabel>
            </motion.div>
          </div>

          {error && (
            <motion.div variants={itemVariants}>
              <Typography variant="small" color="red" className="mb-4 text-center font-medium">
                {error}
              </Typography>
            </motion.div>
          )}
          {success && (
            <motion.div variants={itemVariants}>
              <Typography variant="small" color="green" className="mb-4 text-center font-medium">
                {success}
              </Typography>
            </motion.div>
          )}

          <motion.div variants={itemVariants}>
            <Checkbox
              label={
                <Typography variant="small" color="gray" className="flex items-center font-medium text-gray-700">
                  I agree the&nbsp;
                  <a href="#" className="text-indigo-600 underline hover:text-indigo-800">Terms and Conditions</a>
                </Typography>
              }
              containerProps={{ className: "-ml-2.5" }}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Button
              className="mt-6 bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg transform hover:scale-[1.01] transition-all duration-200 text-white"
              fullWidth
              type="submit"
            >
              Register Now
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
            <Typography variant="paragraph" className="mt-4 font-medium text-center text-blue-gray-500">
              Already have an account?
              <Link to="/auth/sign-in" className="ml-1 text-indigo-600 hover:text-indigo-800">
                Sign in
              </Link>
            </Typography>
          </motion.div>
        </form>
      </motion.div>
    </motion.section>
  );
}

export default SignUp;
