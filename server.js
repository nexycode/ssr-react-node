import express from 'express';
import path from 'path';
import fs from 'fs'
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './ssr-client/src/App';

const app = express();
const port = 3009;

// Serve static files from the build directory
const staticPath = path.join(__dirname, 'ssr-client/build');
app.use(express.static(staticPath));

app.get('*', (req, res) => {
    const context = {};

    // Server-side rendering
    const appHTML = ReactDOMServer.renderToString(
        <StaticRouter location={req.url} context={context}>
            <App />
        </StaticRouter>
    );

    // Read the index.html file and inject the server-rendered app HTML
    fs.readFile(path.join(staticPath, 'index.html'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading index.html', err);
            return res.status(500).send('Error reading index.html');
        }

        // Inject the rendered HTML into the div with id "root"
        const htmlWithApp = data.replace(
            '<div id="root"></div>',
            `<div id="root">${appHTML}</div>`
        );

        res.status(200).send(htmlWithApp);
    });
});

app.listen(port, () => {
    console.log(`Node.js server running on port ${port}`);
});
