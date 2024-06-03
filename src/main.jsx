import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material";
import { MapDataProvider } from "./context/MapDataContext";
import AvenirRegular from "./assets/font/AvenirRegular.ttf";
import MontserratRegular from "./assets/font/MontserratRegular.ttf";
const theme = createTheme({
  palette: {
    main: "#00BAD4",
  },
  typography: {
    fontFamily: "Avenir",
    fonts: [
      {
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: 400,
        src: `local('Montserrat'), local('MontserratRegular'), url(${MontserratRegular}) format('ttf')`,
      },
    ],
    components: {
      MuiCssBaseline: {
        styleOverrides: `
          @font-face {
            font-family: 'Raleway';
            font-style: normal;
            font-display: swap;
            font-weight: 400;
            src: local('Avenir'), local('AvenirRegular'), url(${AvenirRegular}) format('ttf');
            unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
          }
        `,
      },
    },
    h1: {
      fontSize: "3rem",
      fontWeight: 600,
    },
    h2: {
      fontSize: "1.75rem",
      fontWeight: 600,
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 600,
    },
  },
});
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <MapDataProvider>
        <App />
      </MapDataProvider>
    </ThemeProvider>
  </React.StrictMode>
);
