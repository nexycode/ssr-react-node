import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';

import Root from './route';
const container = document.getElementById('root');


if (container.hasChildNodes()) {
    hydrateRoot(container, <Root />);
} else {
    createRoot(container).render(<Root />);
}