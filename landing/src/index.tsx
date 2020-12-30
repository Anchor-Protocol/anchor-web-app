import React from 'react';
import ReactDOM from 'react-dom';
import Regl from 'regl';
import { App } from './App';
import reportWebVitals from './reportWebVitals';
import {init} from 'pages/index/components/BetterSavings'

init()

//ReactDOM.render(<App />, document.getElementById('root'));

//const regl = Regl({
//      container: document.getElementById('root')!,
//      attributes: {
//        antialias: true,
//        alpha: true,
//      },
//    });
//
//    play(regl, animate(regl));
    
    //setTimeout(() => {
    //  stop();
    //}, 1000);

    //return () => stop();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
