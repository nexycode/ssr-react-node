import React from 'react';
import ReactDOMServer from 'react-dom/server';
import path from 'path';
import AppSSR from './ssr-client/src/AppSSR';
import express from 'express';
import fs from 'fs';

const app = express();
const port = 3009;
const bootstrapScripts = [];
const bootstrapCSS = [];

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

app.get("/", (req, res) => {
    res.socket.on("error", (error) => console.log("Fatal error occurred", error));

    let didError = false;
    const stream = ReactDOMServer.renderToPipeableStream(
        <AppSSR bootStrapCSS={bootstrapCSS} />,
        {
            bootstrapScripts,
            onShellReady: () => {
                res.statusCode = didError ? 500 : 200;
                res.setHeader("Content-Type", "text/html");
                stream.pipe(res);
            },
            onError: (error) => {
                didError = true;
                console.log("Error", error);
            }
        }
    );
});

// Serve static files correctly
app.use('/static', express.static(staticPathRoot));


app.listen(port, () => console.log(`Node.js server running on port ${port}`));
