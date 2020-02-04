import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import {Route,BrowserRouter} from 'react-router-dom';
import LoginComponent from './login/login'
import DashboardComponent from './dashboard/dashboard'

const firebase=require("firebase");
require("firebase/firestore");


const routing = (
    <BrowserRouter>
        <div id='routing-container'>
            <Route path="/login" component={LoginComponent}></Route>
            <Route path="/dashboard" component={DashboardComponent}></Route>
        </div>
    </BrowserRouter>
)
firebase.initializeApp({
});
ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
