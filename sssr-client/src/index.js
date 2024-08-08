import React from 'react';
import ReactDOMClient from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// hydrate
ReactDOMClient.hydrateRoot(document.getElementById("root"), <App />);