
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Apply theme based on system preference or localStorage
// For simplicity, this example defaults to dark mode.
// You could add a theme toggler and save preference to localStorage.
// document.documentElement.classList.add('dark'); 

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
