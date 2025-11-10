import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from "./AuthContext";
import ThemeOption from './ThemeOption';
import { BrowserRouter as Router } from 'react-router-dom';
import "./i18n";
import GreekLanguageRouter from './GreekLanguageRouter';
import { MessagesProvider } from './context/MessagesContext';
import { SnackbarProvider } from './context/SnackbarContext';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
  <ThemeOption>
  <React.StrictMode>
    <SnackbarProvider>
    <AuthProvider>
    {/* <ChakraProvider> */}
    <MessagesProvider>
    <GreekLanguageRouter />
    </MessagesProvider>
    {/* <App /> */}
    </AuthProvider>
    </SnackbarProvider>
    {/* </ChakraProvider> */}
  </React.StrictMode>
  </ThemeOption>
  </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
