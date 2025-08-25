import React, { useState } from "react";
import { Button, Typography, Checkbox } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function ChooseBlogType() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("");
  const [customType, setCustomType] = useState("");

  const blogOptions = [
    "Technology",
    "Travel",
    "Food",
    "Lifestyle",
    "Education",
    "Business",
    "Health",
  ];

  const handleSubmit = () => {
    const finalType = customType || selectedType;
    if (finalType) {
      console.log("Selected Blog Type:", finalType);
      // Send to backend if needed
    }
    navigate("/dashboard/Explore");
  };

  return (
    <div className="flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-8 bg-white shadow-lg dark:bg-gray-800 rounded-xl"
      >
        <Typography
          variant="h5"
          className="mb-6 text-center text-gray-900 dark:text-white"
        >
          Which type of blog do you want to post?
        </Typography>

        <div className="space-y-3">
          {blogOptions.map((option) => (
            <label
              key={option}
              className={`block p-3 border rounded-lg cursor-pointer transition ${
                selectedType === option
                  ? "bg-indigo-600 text-white"
                  : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              }`}
              onClick={() => setSelectedType(option)}
            >
              {option}
            </label>
          ))}
        </div>

        <div className="mt-5">
          <input
            type="text"
            placeholder="Or enter your own category"
            value={customType}
            onChange={(e) => setCustomType(e.target.value)}
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="flex justify-between mt-6">
          <Button
            color="gray"
            variant="outlined"
            onClick={() => navigate("/dashboard/Explore")}
          >
            Skip
          </Button>
          <Button
            color="indigo"
            onClick={handleSubmit}
            disabled={!selectedType && !customType}
          >
            Continue
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
