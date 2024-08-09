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
const bootstrapScripts = [];
const bootstrapCSS = [];

const staticPath = path.join(__dirname, 'ssr-client/build');
app.use(express.static(staticPath));

const staticPathRoot = path.join(__dirname, 'ssr-client/build/static');

// Function to populate the JS and CSS arrays
const readDirectoryContentToArray = (folderPath, array) => {
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.log(`Unable to scan this folder ${folderPath}: ${err.message}`);
            return;
        }

        files.forEach((fileName) => {
            if ((fileName.startsWith('main.') && fileName.endsWith('.js')) || fileName.endsWith('.css')) {
                array.push(`/static/${path.relative(staticPathRoot, path.join(folderPath, fileName))}`);
            }
        });
    });
};

// Populate the arrays with JS and CSS files
readDirectoryContentToArray(`${staticPathRoot}/js`, bootstrapScripts);
readDirectoryContentToArray(`${staticPathRoot}/css`, bootstrapCSS);


app.get('*', (req, res) => {
    const context = {};
    const helmetContext = {};

    // Server-side rendering with HelmetProvider
    const appHTML = ReactDOMServer.renderToString(
        <HelmetProvider context={helmetContext}>
            <StaticRouter location={req.url} context={context}>
                <App />
            </StaticRouter>
        </HelmetProvider>
    );

    // Extract the helmet data from the helmetContext after rendering
    const { helmet } = helmetContext;

    // Verify if the index.html file exists
    const indexPath = path.join(staticPath, 'index.html');
    if (!fs.existsSync(indexPath)) {
        console.error(`Error: ${indexPath} does not exist. Make sure to run 'npm run build' in the 'ssr-client' directory.`);
        return res.status(500).send('Internal Server Error');
    }

    // Read the index.html file and inject the server-rendered app HTML
    fs.readFile(indexPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading index.html', err);
            return res.status(500).send('Error reading index.html');
        }

        // Write the head and initial parts of the HTML
        res.write(
            `<!DOCTYPE html>
            <html ${helmet.htmlAttributes.toString()}>
            <head>
                ${helmet.title.toString()}
                ${helmet.meta.toString()}
                ${helmet.link.toString()}
                ${helmet.style.toString()}
                ${bootstrapCSS.map(link => `<link rel="stylesheet" href="${link}">`).join('\n')}
                ${bootstrapScripts.map(script => `<script src="${script}" defer></script>`).join('\n')}
            </head>
            <body ${helmet.bodyAttributes.toString()}>
            <div id="root">${appHTML}</div>
            `
        );

        // End the response with the remaining parts of the HTML
        res.end(
            `</body>
            </html>`
        );
    });
});

app.get("/", (req, res) => {
    return res.send("home page")
})

app.use('/static', express.static(staticPathRoot));


app.listen(port, () => {
    console.log(`Node.js server running on port ${port}`);
});
