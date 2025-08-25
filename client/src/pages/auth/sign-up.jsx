import React, { useState } from "react";
import { Button, Typography, Checkbox } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthContext";
import AuthService from "@/services/api/auth";
import { signInWithPopup, auth, provider } from "@/firebase";
import { motion } from "framer-motion";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Password } from "primereact/password";
import { Carousel } from "primereact/carousel";

export function SignUp() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const categories = [
    {
      name: "Technology",
      image: "https://cdn-icons-png.flaticon.com/512/2721/2721263.png",
    },
    {
      name: "Travel",
      image: "https://cdn-icons-png.flaticon.com/512/854/854894.png",
    },
    {
      name: "Food",
      image: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png",
    },
    {
      name: "Lifestyle",
      image: "https://cdn-icons-png.flaticon.com/512/2921/2921822.png",
    },
    {
      name: "Education",
      image: "https://cdn-icons-png.flaticon.com/512/201/201818.png",
    },
    {
      name: "Business",
      image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    },
    {
      name: "Health",
      image: "https://cdn-icons-png.flaticon.com/512/2966/2966481.png",
    },
  ];

  const categoryTemplate = (category) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="flex flex-col items-center p-4 shadow-md bg-white/20 dark:bg-gray-700 rounded-xl"
    >
      <img
        src={category.image}
        alt={category.name}
        className="object-contain w-32 h-32"
      />
      <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
        {category.name}
      </p>
    </motion.div>
  );

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const response = await AuthService.googleLogin({
        email: user.email,
        name: user.displayName,
      });
      login(response.token);
      navigate("/dashboard/Explore");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleSendOtp = async (event) => {
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
      await AuthService.signUpUser({ name, email, password });
      setStep(2);
      setSuccess("OTP sent to your email!");
    } catch (err) {
      setError(
        err?.response?.data?.warning || "Failed to send OTP. Please try again."
      );
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }

    try {
      const res = await AuthService.verifyOtp({ email, otp });
      login(res.token);
      navigate("/dashboard/Explore");
    } catch (err) {
      setError("OTP verification failed. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen transition-colors duration-300 bg-gray-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Left side */}
      <div className="items-center justify-center hidden w-1/2 p-10 text-white lg:flex">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="mb-4 text-4xl font-bold text-black dark:text-white drop-shadow-lg">
            "Your Words Can Change the World"
          </h1>
          <p className="text-lg text-black opacity-90 dark:text-gray-300">
            Start sharing your journey today and inspire a community of readers.
          </p>
          <div className="mx-auto mt-10 w-72">
            <Carousel
              value={categories}
              itemTemplate={categoryTemplate}
              numVisible={1}
              numScroll={1}
              circular
              autoplayInterval={2500}
            />
          </div>
        </motion.div>
      </div>

      {/* Right side */}
      <div className="flex items-center justify-center flex-1 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md p-8 transition-colors duration-300 bg-white shadow-lg dark:bg-gray-800 rounded-2xl"
        >
          <h2 className="mb-6 text-2xl font-bold text-center text-gray-900 dark:text-white">
            {step === 1 ? "Create an Account" : "Enter OTP"}
          </h2>

          {step === 1 && (
            <form className="space-y-6" onSubmit={handleSendOtp}>
              <FloatLabel>
                <InputText
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                />
                <label htmlFor="name" className="dark:text-gray-300">
                  Your Name
                </label>
              </FloatLabel>

              <FloatLabel>
                <InputText
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                />
                <label htmlFor="email" className="dark:text-gray-300">
                  Your Email
                </label>
              </FloatLabel>

              <FloatLabel>
                <Password
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                  inputClassName="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                  feedback={false}
                />
                <label htmlFor="password" className="dark:text-gray-300">
                  Password
                </label>
              </FloatLabel>

              <FloatLabel>
                <Password
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full"
                  inputClassName="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                  feedback={false}
                />
                <label
                  htmlFor="confirm-password"
                  className="dark:text-gray-300"
                >
                  Confirm Password
                </label>
              </FloatLabel>

              {error && (
                <Typography variant="small" color="red" className="text-center">
                  {error}
                </Typography>
              )}
              {success && (
                <Typography
                  variant="small"
                  color="green"
                  className="text-center"
                >
                  {success}
                </Typography>
              )}

              <Checkbox
                label={
                  <Typography
                    variant="small"
                    color="gray"
                    className="flex items-center font-medium text-gray-700 dark:text-gray-300"
                  >
                    I agree to the&nbsp;
                    <a href="#" className="text-indigo-600 underline">
                      Terms and Conditions
                    </a>
                  </Typography>
                }
                className="dark:accent-purple-400"
              />

              <motion.div whileHover={{ scale: 1.02 }}>
                <Button
                  className="text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                  fullWidth
                  type="submit"
                >
                  Send OTP
                </Button>
              </motion.div>

              {/* Divider */}
              <div className="flex items-center justify-center my-4">
                <span className="w-1/5 border-t border-gray-300 dark:border-gray-600"></span>
                <span className="mx-3 text-sm text-gray-500 dark:text-gray-400">
                  OR
                </span>
                <span className="w-1/5 border-t border-gray-300 dark:border-gray-600"></span>
              </div>

              <motion.div whileHover={{ scale: 1.02 }}>
                <Button
                  size="lg"
                  color="white"
                  className="flex items-center justify-center gap-3 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                  fullWidth
                  onClick={loginWithGoogle}
                >
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    className="w-5 h-5"
                  />
                  Sign up with Google
                </Button>
              </motion.div>

              <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/auth/sign-in"
                  className="text-blue-500 hover:underline"
                >
                  Log in
                </Link>
              </p>
            </form>
          )}

          {step === 2 && (
            <form className="space-y-6" onSubmit={handleVerifyOtp}>
              <FloatLabel>
                <InputText
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-3 py-2 bg-white border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                />
                <label htmlFor="otp" className="dark:text-gray-300">
                  Enter OTP
                </label>
              </FloatLabel>

              {error && (
                <Typography variant="small" color="red" className="text-center">
                  {error}
                </Typography>
              )}
              {success && (
                <Typography
                  variant="small"
                  color="green"
                  className="text-center"
                >
                  {success}
                </Typography>
              )}

              <motion.div whileHover={{ scale: 1.02 }}>
                <Button
                  className="text-white bg-green-600 hover:bg-green-700"
                  fullWidth
                  type="submit"
                >
                  Verify & Register
                </Button>
              </motion.div>

              <Button variant="outlined" fullWidth onClick={() => setStep(1)}>
                Back
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default SignUp;
