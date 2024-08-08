import React from 'react';
import { StaticRouter } from 'react-router-dom/server';
import PropTypes from 'prop-types';
import App from './App';

const AppSSR = ({ bootStrapCSS, location }) => {
    return (
        <StaticRouter location={location}>
            <html>
                <head>
                    <meta charSet="utf-8"/>
                    <title>SSR Client Title</title>
                    {bootStrapCSS.map(cssPath => <link key={cssPath} rel="stylesheet" href={cssPath}></link>)}
                </head>
                <body>
                    <div id="root">
                        <App />
                    </div>
                </body>
            </html>
        </StaticRouter>
    );
};

AppSSR.propTypes = {
    bootStrapCSS: PropTypes.arrayOf(PropTypes.string).isRequired,
    location: PropTypes.string.isRequired,
};

export default AppSSR;
