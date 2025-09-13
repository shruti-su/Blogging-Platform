import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Input,
  Textarea,
  Switch,
  Typography,
} from "@material-tailwind/react";
import { Carousel } from "primereact/carousel";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthContext"; // Adjust the import path as necessary

import {
  ArrowUpTrayIcon,
  ChartBarIcon,
  LockClosedIcon,
  BoltIcon,
  PencilSquareIcon,
  SparklesIcon,
  DevicePhoneMobileIcon,
  ShieldCheckIcon,
  PaintBrushIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilIcon,
  UserPlusIcon,
  ShareIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    name: "Easy Editor",
    description:
      "Write and format your blogs effortlessly with our intuitive editor.",
    icon: PencilSquareIcon,
  },
  {
    name: "SEO Optimized",
    description:
      "Reach more readers with built-in SEO tools and best practices.",
    icon: ChartBarIcon,
  },
  {
    name: "Custom Themes",
    description:
      "Choose from dozens of beautiful templates to personalize your blog.",
    icon: PaintBrushIcon,
  },
  {
    name: "Mobile Ready",
    description: "Your blog looks perfect on any device, big or small.",
    icon: DevicePhoneMobileIcon,
  },
  {
    name: "Secure & Fast",
    description:
      "Hosted on a secure, blazing-fast infrastructure for peace of mind.",
    icon: ShieldCheckIcon,
  },
  {
    name: "AI Suggestions",
    description: "Get AI-powered writing suggestions to improve your content.",
    icon: SparklesIcon,
  },
];

const steps = [
  {
    name: "Sign Up",
    description:
      "Create your free account in seconds and set up your personal blogging space.",
    icon: UserPlusIcon,
  },
  {
    name: "Write Your First Post",
    description:
      "Use our powerful editor to draft, format, and design your blog with ease.",
    icon: PencilIcon,
  },
  {
    name: "Share with the World",
    description:
      "Publish instantly and share your stories across social media platforms.",
    icon: ShareIcon,
  },
];

const faqs = [
  {
    question: "Is my data secure?",
    answer:
      "Yes, your data is secure. We use industry-standard encryption and never share your data with third parties without your consent.",
  },
  {
    question: "Can I customize my blog's appearance?",
    answer:
      "Absolutely! We offer a wide range of customizable themes and layouts to make your blog uniquely yours.",
  },
  {
    question: "How can I monetize my blog?",
    answer:
      "We provide built-in tools for ads, affiliate links, and paid subscriptions to help you start earning from your content.",
  },
  {
    question: "Is there a free plan available?",
    answer:
      "Yes, we offer a free plan with all the essential features to get you started. You can upgrade anytime for more advanced features.",
  },
];

const testimonials = [
  {
    name: "Sophia Martinez",
    role: "Lifestyle Blogger",
    feedback:
      "This platform gave me the tools to launch my blog in less than a week. The editor is super intuitive, and I can finally focus on writing instead of struggling with setup.",
  },
  {
    name: "James Carter",
    role: "Tech Blogger",
    feedback:
      "I love the built-in SEO and analytics. My articles started ranking faster, and the dashboard makes it so easy to track growth. It's like having a mini marketing team!",
  },
  {
    name: "Aisha Khan",
    role: "Food & Travel Blogger",
    feedback:
      "Switching to this platform was the best decision. The customizable themes make my blog look professional, and the mobile experience is flawless for my readers.",
  },
  {
    name: "Daniel Chen",
    role: "Finance Blogger",
    feedback:
      "Monetization tools are a game-changer. I was able to integrate ads and subscriptions without coding. Finally, my blog is more than just a passion project.",
  },
  {
    name: "Emily Johnson",
    role: "Parenting Blogger",
    feedback:
      "The community here is amazing! I’ve connected with other writers, shared tips, and even collaborated on content. Blogging feels less lonely now.",
  },
];

const SITEMAP = [
  {
    title: "Company",
    links: ["About Us", "Careers", "Our Team", "Projects"],
  },
  {
    title: "Help Center",
    links: ["Discord", "Twitter", "GitHub", "Contact Us"],
  },
  {
    title: "Resources",
    links: ["Blog", "Newsletter", "Free Products", "Affiliate Program"],
  },
];

const currentYear = new Date().getFullYear();

const backgroundImages = [
  "/img/3834143.jpg",
  "/img/travel2.jpg",
  "/img/1701.jpg",
  "/img/Education.jpg",
];

export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { isAuthenticated, userRole } = useAuth();
  const [currentBackground, setCurrentBackground] = useState(0);
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  const prev = () =>
    setIndex((index - 1 + testimonials.length) % testimonials.length);
  const next = () => setIndex((index + 1) % testimonials.length);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      // Cycle through the background images
      setCurrentBackground((prev) => (prev + 1) % backgroundImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  // Automatically cycle testimonials and reset timer on manual navigation
  useEffect(() => {
    const testimonialInterval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(testimonialInterval);
  }, [index]);

  const handleCreateBlogClick = () => {
    if (isAuthenticated) {
      navigate("/dashboard/upload-blog");
    } else {
      navigate("/auth/sign-up");
    }
  };

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(!darkMode);
  };
  function go_to_dashboard_or_login() {
    try {
      if (isAuthenticated == true) {
        if (userRole() === "admin") {
          navigate("/admin/admin-home");
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
        <div className="flex items-center justify-between px-2 py-4 mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            Blogging Platform
          </h1>
          <nav className="items-center hidden gap-6 md:flex">
            <a href="#" className="font-medium hover:text-indigo-500">
              Home
            </a>
            <a href="#features" className="font-medium hover:text-indigo-500">
              Features
            </a>
            <a href="#steps" className="font-medium hover:text-indigo-500">
              Steps
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
            <a href="#steps" className="hover:text-indigo-500">
              Steps
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
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex min-h-screen flex-col items-center justify-start pt-44 p-4 text-center overflow-hidden bg-cover bg-center transition-[background-image] duration-1000 ease-in-out"
        style={{
          // You can replace this with your desired background image
          // The background image will now cycle through the array
          backgroundImage: `url(${backgroundImages[currentBackground]})`,
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/60 z-10" />

        {/* Hero Content */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl font-extrabold leading-tight text-white md:text-5xl lg:text-6xl mb-4 z-20"
        >
          Publish your passions, your way
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl lg:text-2xl text-gray-200 mb-8 max-w-2xl font-light z-20"
        >
          Create a unique and beautiful blog easily.
        </motion.p>

        <motion.button
          onClick={handleCreateBlogClick}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="py-3 px-10 text-lg font-semibold bg-orange-500 hover:bg-orange-600 transition-colors duration-300 rounded-full text-white shadow-xl z-20"
        >
          CREATE YOUR BLOG
        </motion.button>
      </motion.section>
      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-2 text-center">
          {/* Features Grid */}
          <div className="p-12 bg-gray-100 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl">
            {/* Section Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4"
            >
              Why Choose Our Platform?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto"
            >
              Everything you need to create, grow, and share your blog —
              beautifully and effortlessly.
            </motion.p>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.01 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
                >
                  {/* Icon */}
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-orange-100 dark:bg-orange-500/20">
                    <feature.icon className="w-8 h-8 text-orange-500" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-black dark:text-white mb-2">
                    {feature.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-900 dark:text-gray-300">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Steps Section */}
      <section id="steps" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-2 text-center">
          <div className="p-12 bg-gray-200 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl">
            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4"
            >
              How It Works
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto"
            >
              Get started with blogging in just three simple steps.
            </motion.p>

            {/* Steps */}
            <div className="grid gap-10 md:grid-cols-3">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.01 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
                >
                  {/* Icon */}
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-orange-100 dark:bg-orange-500/20">
                    <step.icon className="w-8 h-8 text-orange-500" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    {step.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-300">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
      <section id="testimonals" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            What Our Users Say
          </h2>

          {/* Cards */}
          <div className="relative flex items-center justify-center">
            <button
              onClick={prev}
              className="absolute left-0 z-10 p-3 bg-white rounded-full shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <ChevronLeftIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>

            <motion.div
              key={index}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <div className="mx-auto max-w-lg bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md flex flex-col text-left">
                <span className="text-6xl text-black dark:text-white mb-2">
                  <svg
                    className="w-12 h-12"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.505 5.873C10.568 8.393 8.6 11.43 8.6 14.98c0 1.105.193 1.657.577 1.657l.396-.107c.312-.12.563-.18.756-.18c1.127 0 2.07.41 2.825 1.23c.756.82 1.134 1.83 1.134 3.036c0 1.157-.41 2.14-1.225 2.947c-.816.807-1.8 1.21-2.952 1.21c-1.608 0-2.935-.66-3.98-1.983c-1.043-1.32-1.564-2.98-1.564-4.977c0-2.26.442-4.327 1.33-6.203c.89-1.875 2.244-3.57 4.068-5.085c1.824-1.514 2.988-2.272 3.492-2.272c.336 0 .612.162.828.486c.216.323.324.605.324.845l-.107.288zm12.96 0c-3.937 2.52-5.904 5.556-5.904 9.108c0 1.105.193 1.657.577 1.657l.396-.107c.312-.12.563-.18.756-.18c1.103 0 2.04.41 2.807 1.23c.77.82 1.152 1.83 1.152 3.036c0 1.157-.41 2.14-1.225 2.947c-.816.807-1.8 1.21-2.952 1.21c-1.608 0-2.935-.66-3.98-1.983c-1.043-1.32-1.564-2.98-1.564-4.977c0-2.284.448-4.37 1.35-6.256c.9-1.887 2.255-3.577 4.067-5.067C24.76 5 25.917 4.254 26.42 4.254c.337 0 .613.162.83.486c.215.324.323.606.323.846l-.108.287z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                <div className="flex mb-3 text-orange-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="text-xl font-bold leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
                  “{testimonials[index].feedback}”
                </p>
                <div>
                  <h4 className="text-xl font-semibold text-purple-600">
                    {testimonials[index].name}
                  </h4>
                  <p className="text-base text-gray-500">
                    {testimonials[index].role}
                  </p>
                </div>
              </div>
            </motion.div>

            <button
              onClick={next}
              className="absolute right-0 z-10 p-3 bg-white rounded-full shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <ChevronRightIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, i) => (
              <span
                key={i}
                className={`h-2 w-2 rounded-full ${
                  index === i ? "bg-purple-600" : "bg-gray-300 dark:bg-gray-600"
                }`}
              ></span>
            ))}
          </div>
        </div>
      </section>
      {/* Contact Section */}
      <section
        id="contact"
        className="py-20 bg-gradient-to-b from-white via-orange-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
      >
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side: Info */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6">
              Get in Touch
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Have questions or feedback? We'd love to hear from you. Reach out
              using the form or through our contact details.
            </p>

            <ul className="space-y-4 text-gray-700 dark:text-gray-300">
              <li className="flex items-center space-x-3">
                <svg
                  className="w-6 h-6 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-9 13l-7-5V6a2 2 0 012-2h10a2 2 0 012 2v10l-7 5z"
                  />
                </svg>
                <span>hello@myblog.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg
                  className="w-6 h-6 text-teal-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a2 2 0 011.94 1.5l.62 2.48a2 2 0 01-.45 1.82l-1.2 1.2a11.05 11.05 0 005.2 5.2l1.2-1.2a2 2 0 011.82-.45l2.48.62a2 2 0 011.5 1.94V19a2 2 0 01-2 2h-1C9.163 21 3 14.837 3 7V5z"
                  />
                </svg>
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-3">
                <svg
                  className="w-6 h-6 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 12.414m0 0a4 4 0 10-5.657-5.657 4 4 0 005.657 5.657z"
                  />
                </svg>
                <span>Kolkata, India</span>
              </li>
            </ul>
          </div>

          {/* Right Side: Form */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
            <form className="space-y-6">
              <div>
                <label className="block text-gray-700 dark:text-gray-200 mb-2 font-medium">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
              focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-teal-400
              bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200 mb-2 font-medium">
                  Your Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
              focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-teal-400
              bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200 mb-2 font-medium">
                  Message
                </label>
                <textarea
                  rows="5"
                  placeholder="Type your message..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
              focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-teal-400
              bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-orange-500 to-teal-500 
            text-white font-semibold shadow-md hover:opacity-90 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
      {/* FAQ Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-12"
          >
            Frequently Asked Questions
          </motion.h2>

          <div className="grid gap-8 md:grid-cols-2">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold mb-4">About</h3>
            <p className="text-sm">A modern blogging platform for creators.</p>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Links</h3>
            <ul className="space-y-2 text-sm">
              <li>Home</li>
              <li>Features</li>
              <li>Pricing</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <span>🐦</span>
              <span>💼</span>
              <span>💻</span>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Blogging Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
