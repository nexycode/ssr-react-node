import express from 'express';
import path from 'path';
import fs from 'fs';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import App from './ssr-client/src/App';

const app = express();
const port = 3009;

const staticPath = path.join(__dirname, 'ssr-client/build');
const staticPathRoot = path.join(__dirname, 'ssr-client/build/static');

// Define indexPath for your index.html file
const indexPath = path.join(staticPath, 'index.html');

// Function to populate the JS and CSS arrays
const readDirectoryContentToArray = (folderPath, array) => {
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.log(`Unable to scan this folder ${folderPath}: ${err.message}`);
            return;
        }

        files.forEach((fileName) => {
            if ((fileName.startsWith('main.') && fileName.endsWith('.js')) || fileName.endsWith('.css')) {
                array.push(`/${path.relative(staticPathRoot, path.join(folderPath, fileName))}`);
            }
        });
    });
};

// Populate the arrays with JS and CSS files
const bootstrapScripts = [];
const bootstrapCSS = [];

readDirectoryContentToArray(`${staticPathRoot}/js`, bootstrapScripts);
readDirectoryContentToArray(`${staticPathRoot}/css`, bootstrapCSS);

// Serve static assets 
// app.use(express.static(staticPath)); 

app.use(express.static(path.join(__dirname, 'ssr-client/build/static')));

// Dynamic route handling
app.get('*', (req, res, next) => {
    if (req.url.startsWith('/static')) {
        // If the request is for a static asset, skip the dynamic handler
        return next();
    }

    console.log(`Request received for: ${req.url}`);
    const context = {};
    const helmetContext = {};

    const appHTML = ReactDOMServer.renderToString(
        <HelmetProvider context={helmetContext}>
            <StaticRouter location={req.url} context={context}>
                <App />
            </StaticRouter>
        </HelmetProvider>
    );

    const { helmet } = helmetContext;

    if (!fs.existsSync(indexPath)) {
        console.error(`Error: ${indexPath} does not exist.`);
        return res.status(500).send('Internal Server Error');
    }

    const styles = bootstrapCSS.map(link => `<link rel="stylesheet" href="${link}">`).join('\n');

    fs.readFile(indexPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading index.html', err);
            return res.status(500).send('Error reading index.html');
        }

        res.send(`
            <!DOCTYPE html>
            <html ${helmet.htmlAttributes.toString()}>
            <head>
                ${helmet.title.toString()}
                ${helmet.meta.toString()}
                ${helmet.link.toString()}
                ${helmet.style.toString()}
                ${styles}
                ${bootstrapScripts.map(script => `<script src="${script}" defer></script>`).join('\n')}
            </head>
            <body ${helmet.bodyAttributes.toString()}>
            <div id="root">${appHTML}</div>
            </body>
            </html>
        `);
    });
});

app.listen(port, () => {
    console.log(`Node.js server running on port ${port}`);
});
