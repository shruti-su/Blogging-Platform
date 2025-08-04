import React, { useState, useRef } from "react";
import { Button, Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import AuthService from "@/services/api/auth";
import { motion } from "framer-motion";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Password } from "primereact/password";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { sweetAlert } from "../../components/SweetAlert/SweetAlert";

export function Forgotpassword() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { showSuccess, showError } = sweetAlert();
    const stepperRef = useRef(null);

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

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!email) {
            setError("Please enter your email address.");
            setLoading(false);
            return;
        }

        try {
            const response = await AuthService.forgotPassword(email);
            if (response.success) {
                showSuccess("An OTP has been sent to your email.");
                stepperRef.current.nextCallback();
            } else {
                showError(response.message || "Failed to send password reset email.");
            }
        } catch (err) {
            showError(err.response?.data?.message || "An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!otp || !newPassword || !confirmPassword) {
            setError("Please fill in all fields.");
            setLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters.");
            setLoading(false);
            return;
        }

        try {
            const response = await AuthService.resetPassword({ email, otp, newPassword });
            if (response.success) {
                showSuccess("Password reset successful. You can now sign in.");
                window.location.href = "/auth/sign-in";
            } else {
                showError(response.message || "Invalid OTP or reset failed.");
            }
        } catch (err) {
            showError(err.response?.data?.message || "An error occurred. Please try again.");
        } finally {
            setLoading(false);
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
                className="w-full max-w-xl lg:max-w-2xl rounded-2xl overflow-hidden shadow-2xl shadow-blue-200 bg-white p-6 md:p-10"
            >
                <div className="text-center mb-8">
                    <motion.div variants={itemVariants}>
                        <Typography variant="h2" className="mb-2 font-extrabold text-gray-800">
                            Forgot Password
                        </Typography>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <Typography variant="paragraph" className="text-lg font-normal text-gray-600">
                            Enter your email to receive a password reset OTP.
                        </Typography>
                    </motion.div>
                </div>
                <Stepper ref={stepperRef} style={{ flexBasis: "50rem" }} orientation="vertical">
                    <StepperPanel header="Enter Email">
                        <form onSubmit={handleForgotPassword} className="flex flex-col gap-4">
                            <motion.div variants={itemVariants}>
                                <FloatLabel>
                                    <InputText
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-indigo-500"
                                        disabled={loading}
                                    />
                                    <label
                                        htmlFor="email"
                                        className="block text-sm text-gray-700 "  /* 🔧 Added spacing here */
                                    >
                                        Your Email
                                    </label>
                                </FloatLabel>
                            </motion.div>

                            {error && (
                                <motion.div variants={itemVariants}>
                                    <Typography variant="small" color="red" className="text-center">
                                        {error}
                                    </Typography>
                                </motion.div>
                            )}

                            <motion.div variants={itemVariants}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    className="bg-indigo-600"
                                    disabled={loading}
                                >
                                    {loading ? "Sending..." : "Send OTP"}
                                </Button>
                            </motion.div>
                        </form>
                    </StepperPanel>

                    <StepperPanel header="Reset Password">
                        <form onSubmit={handleResetPassword} className="flex flex-col gap-6">
                            {/* OTP */}
                            <motion.div variants={itemVariants}>
                                <FloatLabel>
                                    <InputText
                                        id="otp"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-indigo-500"
                                        disabled={loading}
                                    />
                                    <label htmlFor="otp">Enter OTP</label>
                                </FloatLabel>
                            </motion.div>

                            {/* New Password */}
                            <motion.div variants={itemVariants}>
                                <FloatLabel>
                                    <Password
                                        id="new-password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full"
                                        inputClassName="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-indigo-500"
                                        feedback={false}
                                        disabled={loading}
                                    />
                                    <label htmlFor="new-password">New Password</label>
                                </FloatLabel>
                            </motion.div>

                            {/* Confirm Password */}
                            <motion.div variants={itemVariants}>
                                <FloatLabel>
                                    <Password
                                        id="confirm-password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full"
                                        inputClassName="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-indigo-500"
                                        feedback={false}
                                        disabled={loading}
                                    />
                                    <label htmlFor="confirm-password">Confirm Password</label>
                                </FloatLabel>
                            </motion.div>

                            {error && (
                                <motion.div variants={itemVariants}>
                                    <Typography variant="small" color="red" className="text-center">
                                        {error}
                                    </Typography>
                                </motion.div>
                            )}

                            {/* Buttons */}
                            <div className="flex py-4 gap-2">
                                <Button
                                    onClick={() => stepperRef.current.prevCallback()}
                                    className="bg-gray-300 text-gray-800 hover:bg-gray-400 transition-all duration-150"
                                    type="button"
                                >
                                    Back
                                </Button>

                                {/* ✅ Submit button for password reset */}
                                <Button
                                    type="submit"
                                    className="bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-150"
                                    disabled={loading}
                                >
                                    {loading ? "Resetting..." : "Reset Password"}
                                </Button>
                            </div>
                        </form>
                    </StepperPanel>
                </Stepper>
            </motion.div>
        </motion.section>
    );
}

export default Forgotpassword;
