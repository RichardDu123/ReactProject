import React from 'react';
import ReactDOM from 'react-dom/client';

// React Router
import { BrowserRouter } from "react-router-dom";

// Toast
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// MUI
import CssBaseline from '@mui/material/CssBaseline';

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <BrowserRouter>
      <CssBaseline />
      <App />
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover
        closeButton={false}
        theme={"dark"}
      />
    </BrowserRouter>
  // </React.StrictMode>
);
