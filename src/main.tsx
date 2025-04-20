import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import { ToastContainer } from 'react-toastify';
import App from './App.jsx';
import 'react-toastify/dist/ReactToastify.css';
import '../src/constants/registerFonts';
import { ThemeProvider } from './context/ThemeContext.js';
import { Provider } from 'react-redux';
import store from './redux/store'; // Assuming the store is in src/store.js

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}> {/* Wrap the app with Redux Provider */}
    <ThemeProvider>
      <React.StrictMode>
        <Router>
          <App />
          <ToastContainer />
        </Router>
      </React.StrictMode>
    </ThemeProvider>
  </Provider>
);
