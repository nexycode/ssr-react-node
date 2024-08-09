import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';

function Root() {
    return (
        <BrowserRouter>
            <HelmetProvider> 
                <React.StrictMode>
                    <App />
                </React.StrictMode> 
            </HelmetProvider>
        </BrowserRouter>
    );
}

export default Root;
