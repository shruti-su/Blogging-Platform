import React from "react";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

function SuspendedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-center p-6">
      <div className="max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl">
        <ExclamationTriangleIcon className="w-20 h-20 mx-auto text-yellow-500 dark:text-yellow-400" />
        <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
          Account Suspended
        </h2>
        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
          Your account has been temporarily suspended due to a violation of our
          terms of service.
        </p>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Please contact support if you believe this is an error.
        </p>
        <Link to="/">
          <Button
            label="Go to Homepage"
            className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700"
          />
        </Link>
      </div>
    </div>
  );
}

export default SuspendedPage;
