import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { IdProvider} from './other/IdContext';
import config from "./common/utility";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <IdProvider>
      <App />
    </IdProvider>
  // </React.StrictMode>
);

console.log("env",config.env)
if(config.env !== "local"){
  console.log = function() {};
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
