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
    datatable: {
        root: {
            className: "text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-lg"
        },
        table: {
            className: "w-full bg-white dark:bg-gray-800"
        },
        thead: {
            className: "bg-purple-600 bg-white text-center "
        },
        headerCell: {
            className: "p-3 text-white text-center font-semibold bg-white bg-purple-600"
        },
        tbody: {
            className: "bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
        },
        bodyRow: ({ props }) => ({
            className: [
                'dark:text-white bg-white dark:bg-gray-800  ',
                // props.rowHover ? 'hover:bg-gray-100 dark:hover:bg-gray-700/50' : ''
            ]
        }),
        bodyCell: {
            className: "p-3 text-center bg-white dark:bg-gray-800"
        },
        paginator: {
            root: {
                className: "bg-white dark:bg-gray-800 dark:text-white border-t border-gray-200 dark:border-gray-700"
            }
        },
         
    }
};