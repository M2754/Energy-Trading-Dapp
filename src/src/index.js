import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
 import { Web3Provider } from './contexts/Web3Context';
import ProducerPortal from './components/ProducerPortal';
import ConsumerPortal from './components/ConsumerPortal';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Web3Provider>
    <App />
   </Web3Provider>
 );
// import React from 'react';
// import ReactDOM from 'react-dom/client';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//     <h1>Hello</h1>
// );