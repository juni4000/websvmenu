import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { Helloworld02 } from './contracts/helloworld02';
import { Statefulsc } from './contracts/stateful';

//import artifact from '../artifacts/src/contracts/helloworld02.json';
import artifact from '../artifacts/helloworld02.json';
import artifact02 from '../artifacts/stateful.json';
Helloworld02.loadArtifact(artifact);

Statefulsc.loadArtifact(artifact02)

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
