import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import reportWebVitals from './reportWebVitals';
import { register } from './serviceWorkderRegistration';

ReactDOM.render(<App />, document.getElementById('root'));

register();
reportWebVitals();
