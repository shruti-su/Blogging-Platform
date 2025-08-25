import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button, Input, Textarea, Switch } from "@material-tailwind/react";
import { Carousel } from "primereact/carousel";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthContext"; // Adjust the import path as necessary

import {
  ArrowUpTrayIcon,
  ChartBarIcon,
  LockClosedIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";

const testimonials = [
  {
    name: "Shruti D.",
    feedback: "Excel Analytics helped me visualize data instantly!",
    position: "Frontend Developer",
    image: "https://randomuser.me/api/portraits/women/75.jpg",
  },
  {
    name: "Sumit D.",
    feedback: "The upload process is seamless and lightning-fast.",
    position: "Data Analyst",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Pooja R.",
    feedback: "Dark mode and interactive charts are a game changer!",
    position: "Business Analyst",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
];

export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { isAuthenticated, userRole } = useAuth(); // Destructure the login function from useAuth\
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
  };
  function go_to_dashboard_or_login() {
    try {
      if (isAuthenticated == true) {
        if (userRole() === "admin") {
          navigate("/admin/");
        } else if (userRole() === "user") {
          navigate("/dashboard/Explore");
        } else {
          navigate("/auth/sign-in");
        }
      } else {
        navigate("/auth/sign-in");
      }
    } catch (e) {
      console.error("Error navigating to dashboard or login:", e);
    }
  }
  return (
    <div className="text-gray-900 transition duration-500 bg-white dark:bg-gray-900 dark:text-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-gray-200 shadow-sm bg-white/80 dark:bg-gray-900/80 backdrop-blur dark:border-gray-700">
        <div className="flex items-center justify-between px-4 py-4 mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            Excel Analytics
          </h1>
          <nav className="items-center hidden gap-6 md:flex">
            <a href="#" className="font-medium hover:text-indigo-500">
              Home
            </a>
            <a href="#features" className="font-medium hover:text-indigo-500">
              Features
            </a>
            <a
              href="#testimonials"
              className="font-medium hover:text-indigo-500"
            >
              Testimonials
            </a>
            <a href="#contact" className="font-medium hover:text-indigo-500">
              Contact
            </a>
            <Link to="/auth/sign-in">
              <Button
                variant="text"
                className="text-indigo-600 dark:text-indigo-400"
              >
                Sign In
              </Button>
            </Link>
            <Link to="/auth/sign-up">
              <Button color="indigo" size="sm">
                Register
              </Button>
            </Link>
            <Switch
              color="indigo"
              checked={darkMode}
              onChange={toggleDarkMode}
            />
          </nav>
          <div className="md:hidden">
            <button onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="flex flex-col gap-4 px-4 pb-4 md:hidden">
            <a href="#" className="hover:text-indigo-500">
              Home
            </a>
            <a href="#features" className="hover:text-indigo-500">
              Features
            </a>
            <a href="#testimonials" className="hover:text-indigo-500">
              Testimonials
            </a>
            <a href="#contact" className="hover:text-indigo-500">
              Contact
            </a>
            <Link to="/auth/sign-in">
              <Button
                variant="text"
                className="text-indigo-600 dark:text-indigo-400"
              >
                Sign In
              </Button>
            </Link>
            <Link to="/auth/sign-up">
              <Button color="indigo" size="sm">
                Register
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <span>🌞</span>
              <Switch
                color="indigo"
                checked={darkMode}
                onChange={toggleDarkMode}
              />
              <span>🌙</span>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section
        className="relative flex flex-col items-center justify-between min-h-screen gap-2 px-6 py-24 shadow-md md:flex-row md:px-12 "
        style={{
          backgroundImage: `
      radial-gradient(circle, #e0e7ff 1px, transparent 1px),
      radial-gradient(circle, #e0e7ff 1px, transparent 1px)
    `,
          backgroundSize: "40px 40px",
          backgroundPosition: "0 0, 20px 20px",
        }}
      >
        {/* Text on the left */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-center md:text-left"
        >
          <h1 className="text-4xl font-bold leading-tight text-gray-900 md:text-5xl dark:text-white">
            Transform Excel Data Into Insights
          </h1>
          <p className="max-w-xl mt-4 text-lg text-gray-600 dark:text-gray-300">
            Upload, Analyze, and Visualize Excel Files in Seconds.
          </p>
          <div className="flex justify-center gap-4 mt-6 md:justify-start">
            <Button size="lg" color="indigo" onClick={go_to_dashboard_or_login}>
              Get Started
            </Button>

            <Button size="lg" variant="outlined" color="indigo">
              See Demo
            </Button>
          </div>
        </motion.div>

        {/* Image on the right */}
        <motion.div
          className="flex-1 w-full max-w-lg"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          whileHover={{ scale: 1.03 }}
        >
          <motion.img
            src="/img/charts.png"
            alt="Excel Analytics"
            className="w-full shadow-xl rounded-xl hover:shadow-2xl"
            whileHover={{
              rotate: [0, 2, -2, 0],
              transition: { duration: 0.6, ease: "easeInOut" },
            }}
            whileTap={{ scale: 0.97 }}
            drag
            dragElastic={0.18}
            dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
          />
        </motion.div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="px-6 py-24 bg-white shadow-md dark:bg-gray-800"
      >
        <h2 className="mb-12 text-3xl font-semibold text-center text-gray-900 dark:text-white">
          Why Excel Analytics?
        </h2>

        <div className="grid grid-cols-1 gap-6 text-center md:grid-cols-4">
          {/* Feature 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="p-6 bg-gray-100 shadow dark:bg-gray-700 rounded-xl hover:shadow-2xl"
          >
            <ArrowUpTrayIcon className="w-10 h-10 mx-auto mb-3 text-indigo-600 dark:text-indigo-400" />
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              Quick Uploads
            </p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Instantly drag and drop Excel files into the dashboard.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-6 bg-gray-100 shadow dark:bg-gray-700 rounded-xl hover:shadow-2xl"
          >
            <ChartBarIcon className="w-10 h-10 mx-auto mb-3 text-indigo-600 dark:text-indigo-400" />
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              Real-time Charts
            </p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Generate dynamic charts immediately after upload.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="p-6 bg-gray-100 shadow dark:bg-gray-700 rounded-xl hover:shadow-2xl"
          >
            <LockClosedIcon className="w-10 h-10 mx-auto mb-3 text-indigo-600 dark:text-indigo-400" />
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              Data Privacy
            </p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Your data remains secure and is never stored.
            </p>
          </motion.div>

          {/* Feature 4 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="p-6 bg-gray-100 shadow dark:bg-gray-700 rounded-xl hover:shadow-2xl"
          >
            <BoltIcon className="w-10 h-10 mx-auto mb-3 text-indigo-600 dark:text-indigo-400" />
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              Fast Analysis
            </p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Get insights from large Excel datasets in seconds.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="px-6 py-24 bg-indigo-50 dark:bg-gray-900"
      >
        <h2 className="mb-12 text-3xl font-semibold text-center">
          What Our Users Say
        </h2>
        <Carousel
          value={testimonials}
          itemTemplate={(item) => (
            <div className="max-w-md p-6 mx-auto text-center bg-white shadow dark:bg-gray-800 rounded-xl">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 mx-auto mb-4 rounded-full"
              />
              <p className="italic">“{item.feedback}”</p>
              <h4 className="mt-4 font-semibold">- {item.name}</h4>
              <span className="text-sm text-gray-500">{item.position}</span>
            </div>
          )}
          numVisible={1}
          circular
          autoplayInterval={4000}
        />
      </section>

      {/* Contact Form / Newsletter */}
      <section id="contact" className="px-6 py-24 bg-white dark:bg-gray-800">
        <h2 className="mb-10 text-3xl font-semibold text-center">
          Stay Updated
        </h2>
        <form className="grid max-w-xl gap-6 mx-auto">
          <Input
            size="lg"
            label="Your Name"
            color="indigo"
            className="bg-white dark:bg-gray-900"
          />
          <Input
            size="lg"
            label="Email Address"
            color="indigo"
            className="bg-white dark:bg-gray-900"
          />
          <Textarea
            label="Message / Suggestion"
            color="indigo"
            className="bg-white dark:bg-gray-900"
            rows={4}
          />
          <Button color="indigo" size="lg">
            Send
          </Button>
        </form>
      </section>

      {/* FAQ Section */}
      <footer className="px-6 py-24 text-gray-800 bg-gray-100 dark:bg-gray-900 dark:text-white">
        <h2 className="mb-10 text-3xl font-semibold text-center">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <h4 className="font-bold">Is my Excel data secure?</h4>
            <p>
              Yes. We never store your files and all processing is done
              securely.
            </p>
          </div>
          <div>
            <h4 className="font-bold">What file types are supported?</h4>
            <p>Currently we support .xls, .xlsx, and .csv files.</p>
          </div>
          <div>
            <h4 className="font-bold">Can I download the analysis?</h4>
            <p>Yes. Visualizations and summaries can be exported easily.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
