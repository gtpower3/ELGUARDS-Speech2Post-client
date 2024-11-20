import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './i18n';

const root = ReactDOM.createRoot(document.getElementById('root'));

const themeEN = createTheme({
  palette: {
    text: {
      primary: "#1a1833",
    },
    primary: {
      main: "#0550F0",
    },
    secondary: {
      main: "#fff"
    }
  },
  typography: {
    fontFamily: "Aeonik Regular",
  },
});

const themeAR = createTheme({
  palette: {
    text: {
      primary: "#1a1833",
    },
    primary: {
      main: "#0550F0",
    },
    secondary: {
      main: "#aaa7D0",
      contrastText: "#fff"
    }
  },
  typography: {
    fontFamily: "Al Qabas Regular",
  },
});
root.render(
  <ThemeProvider theme={themeAR}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
