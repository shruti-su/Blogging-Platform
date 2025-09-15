// src/config/primereact-config.js

/**
 * Global Pass Through (pt) configuration for PrimeReact components.
 * This allows for consistent styling across the application.
 * Component names are in lowercase.
 */
export const ptConfig = {
    dialog: {
        // Make inner elements transparent to allow the root background to show through.
        // Also, remove default borders that are no longer needed.
        header: {
            className: "bg-white dark:bg-gray-800 text-gray-800 dark:text-white ",
        },
        content: { className: " bg-white dark:bg-gray-800" },
        footer: { className: "bg-white dark:bg-gray-800 " },
    },
};