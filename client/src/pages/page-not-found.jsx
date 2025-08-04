import { Link } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import React from "react";
import FuzzyText from "@/components/FuzzyText";

export default function PageNotFound() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen px-6 py-12 text-center bg-white dark:bg-gray-900">
      <div className="mt-[-4rem] flex flex-col items-center">
        {/* Fuzzy 404 */}
        <FuzzyText
          fontSize="clamp(2rem, 10vw, 10rem)"
          fontWeight={900}
          enableHover={true}
          baseIntensity={0.4}
          hoverIntensity={0.5}
          color="4f46e5"
        >
          404
        </FuzzyText>

        {/* Spacer */}
        <div className="h-6" />

        {/* Fuzzy "Page Not Found" */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <FuzzyText
            fontSize="clamp(1.5rem, 4vw, 2.5rem)"
            fontWeight={700}
            enableHover={true}
            baseIntensity={0.3}
            hoverIntensity={0.5}
            color="ffffff"
          >
            Page Not Found
          </FuzzyText>
        </motion.div>

        {/* Subtitle */}
        <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-md">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>

        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 mt-6 text-sm font-medium text-white transition-all bg-indigo-600 rounded-lg hover:bg-indigo-700"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Go Back Home
        </Link>
      </div>
    </section>
  );
}
