import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@material-tailwind/react";
import { MaterialTailwindControllerProvider } from "@/components/context";
import { ptConfig } from "./primereact-config";
import { PrimeReactProvider, PrimeReactContext } from "primereact/api";
import { ThemeProvider as CustomThemeProvider } from "@/components/context/ThemeContext"; // Renamed to avoid conflict

/* Core PrimeReact CSS */
import "primereact/resources/themes/lara-light-indigo/theme.css";

// import "primereact/resources/themes/bootstrap4-light-blue/theme.css";
/* Choose your PrimeReact theme here 
primereact/resources/themes/bootstrap4-light-blue/theme.css
primereact/resources/themes/bootstrap4-light-purple/theme.css
primereact/resources/themes/bootstrap4-dark-blue/theme.css
primereact/resources/themes/bootstrap4-dark-purple/theme.css
primereact/resources/themes/md-light-indigo/theme.css
primereact/resources/themes/md-light-deeppurple/theme.css
primereact/resources/themes/md-dark-indigo/theme.css
primereact/resources/themes/md-dark-deeppurple/theme.css
primereact/resources/themes/mdc-light-indigo/theme.css
primereact/resources/themes/mdc-light-deeppurple/theme.css
primereact/resources/themes/mdc-dark-indigo/theme.css
primereact/resources/themes/mdc-dark-deeppurple/theme.css
primereact/resources/themes/tailwind-light/theme.css
primereact/resources/themes/fluent-light/theme.css
primereact/resources/themes/lara-light-blue/theme.css
primereact/resources/themes/lara-light-indigo/theme.css
primereact/resources/themes/lara-light-purple/theme.css
primereact/resources/themes/lara-light-teal/theme.css
primereact/resources/themes/lara-dark-blue/theme.css
primereact/resources/themes/lara-dark-indigo/theme.css
primereact/resources/themes/lara-dark-purple/theme.css
primereact/resources/themes/lara-dark-teal/theme.css
primereact/resources/themes/soho-light/theme.css
primereact/resources/themes/soho-dark/theme.css
primereact/resources/themes/viva-light/theme.css
primereact/resources/themes/viva-dark/theme.css
primereact/resources/themes/mira/theme.css
primereact/resources/themes/nano/theme.css
primereact/resources/themes/saga-blue/theme.css
primereact/resources/themes/saga-green/theme.css
primereact/resources/themes/saga-orange/theme.css
primereact/resources/themes/saga-purple/theme.css
primereact/resources/themes/vela-blue/theme.css
primereact/resources/themes/vela-green/theme.css
primereact/resources/themes/vela-orange/theme.css
primereact/resources/themes/vela-purple/theme.css
primereact/resources/themes/arya-blue/theme.css
primereact/resources/themes/arya-green/theme.css
primereact/resources/themes/arya-orange/theme.css
primereact/resources/themes/arya-purple/theme.css
*/
/* You can find other themes in `primereact/resources/themes/` */
/* Examples: `saga-blue`, `vela-blue`, `arya-blue`, `nova`, `fluent-light` */

import "primereact/resources/primereact.min.css"; /* Core CSS */
import "primeicons/primeicons.css"; /* PrimeIcons (for icons used by PrimeReact components) */

import "./index.css";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CustomThemeProvider>
      <PrimeReactProvider value={{ pt: ptConfig }}>
        <BrowserRouter>
          <ThemeProvider>
            <MaterialTailwindControllerProvider>
              <App />
            </MaterialTailwindControllerProvider>
          </ThemeProvider>
        </BrowserRouter>
      </PrimeReactProvider>
    </CustomThemeProvider>
  </React.StrictMode>
);
