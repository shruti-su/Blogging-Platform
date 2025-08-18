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

  // Step 1: Send OTP (this is signup)
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
      const res = await AuthService.signUpUser({ name, email, password });
      setStep(2);
      setSuccess("OTP sent to your email!");
    } catch (err) {
      setError(err?.response?.data?.warning || "Failed to send OTP. Please try again.");
    }
  };

  // Step 2: Verify OTP
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
      navigate("/dashboard/home");
    } catch (err) {
      setError("OTP verification failed. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Left side */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-purple-600 to-blue-500 items-center justify-center text-white p-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold mb-4">Join Our Blogging Community</h1>
          <p className="text-lg">
            Share your thoughts, ideas, and stories with the world.
          </p>
          <img
            src="https://cdn-icons-png.flaticon.com/512/2921/2921822.png"
            alt="Blog Illustration"
            className="mx-auto mt-8 w-64"
          />
        </motion.div>
      </div>

      {/* Right side */}
      <div className="flex flex-1 items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
            {step === 1 ? "Create an Account" : "Enter OTP"}
          </h2>

          {/* Step 1: Registration Form */}
          {step === 1 && (
            <form className="space-y-5" onSubmit={handleSendOtp}>
              <FloatLabel>
                <InputText
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
                <label htmlFor="name">Your Name</label>
              </FloatLabel>

              <FloatLabel>
                <InputText
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
                <label htmlFor="email">Your Email</label>
              </FloatLabel>

              <FloatLabel>
                <Password
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                  inputClassName="w-full px-3 py-2 border rounded-md"
                  feedback={false}
                />
                <label htmlFor="password">Password</label>
              </FloatLabel>

              <FloatLabel>
                <Password
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full"
                  inputClassName="w-full px-3 py-2 border rounded-md"
                  feedback={false}
                />
                <label htmlFor="confirm-password">Confirm Password</label>
              </FloatLabel>

              {error && (
                <Typography variant="small" color="red" className="mb-2 text-center font-medium">
                  {error}
                </Typography>
              )}
              {success && (
                <Typography variant="small" color="green" className="mb-2 text-center font-medium">
                  {success}
                </Typography>
              )}

              <Checkbox
                label={
                  <Typography variant="small" color="gray" className="flex items-center font-medium text-gray-700">
                    I agree to the&nbsp;
                    <a href="#" className="text-indigo-600 underline">
                      Terms and Conditions
                    </a>
                  </Typography>
                }
              />

              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" fullWidth type="submit">
                Send OTP
              </Button>

              <Button
                size="lg"
                color="white"
                className="flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600"
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

              <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                Already have an account?{" "}
                <Link to="/auth/sign-in" className="text-blue-500 hover:underline">
                  Log in
                </Link>
              </p>
            </form>
          )}

          {/* Step 2: OTP Form */}
          {step === 2 && (
            <form className="space-y-5" onSubmit={handleVerifyOtp}>
              <FloatLabel>
                <InputText
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
                <label htmlFor="otp">Enter OTP</label>
              </FloatLabel>

              {error && (
                <Typography variant="small" color="red" className="mb-2 text-center font-medium">
                  {error}
                </Typography>
              )}
              {success && (
                <Typography variant="small" color="green" className="mb-2 text-center font-medium">
                  {success}
                </Typography>
              )}

              <Button className="bg-green-600 hover:bg-green-700 text-white" fullWidth type="submit">
                Verify & Register
              </Button>

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
