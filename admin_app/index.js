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
    apiKey: "AIzaSyCOeFH-Yz5SHdkn39-VB5bUGjZnah5JYTQ",
    authDomain: "senti-937c7.firebaseapp.com",
    databaseURL: "https://senti-937c7.firebaseio.com",
    projectId: "senti-937c7",
    storageBucket: "senti-937c7.appspot.com",
    messagingSenderId: "521652480932",
    appId: "1:521652480932:web:9814aebc68a6b3a522ef31",
    measurementId: "G-32K8Z9E7JQ"
});
ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
