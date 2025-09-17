import React from "react";
import { Link } from "react-router-dom";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

function SuspendedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-md w-full p-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 text-center">
        {/* Warning Icon */}
        <div className="w-20 h-20 mx-auto flex items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/40 shadow-md">
          <ExclamationTriangleIcon className="w-12 h-12 text-yellow-500 dark:text-yellow-400" />
        </div>

        {/* Heading */}
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
          Account Suspended
        </h2>

        {/* Description */}
        <p className="mt-4 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
          Your account has been temporarily suspended due to a violation of our{" "}
          <span className="font-medium text-gray-900 dark:text-gray-100">
            terms of service
          </span>
          .
        </p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Please contact support if you believe this is an error.
        </p>

        {/* CTA Button */}
        <Link to="/" className="block mt-8">
          <button className="w-full px-6 py-3 font-semibold text-white rounded-xl shadow-md bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transform hover:scale-[1.02] transition-all">
            Go to Homepage
          </button>
        </Link>
      </div>
    </div>
  );
}

export default SuspendedPage;
