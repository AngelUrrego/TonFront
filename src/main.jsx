import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// Polyfill para Buffer
import { Buffer } from 'buffer';

window.Buffer = Buffer;

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);
