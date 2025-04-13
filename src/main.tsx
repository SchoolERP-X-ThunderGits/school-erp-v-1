import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css'
import { ToastContainer } from 'react-toastify';
import App from './App.jsx'
import 'react-toastify/dist/ReactToastify.css';
import '../src/constants/registerFonts'
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <App />
      <ToastContainer />
    </Router>
  </React.StrictMode>,
);
