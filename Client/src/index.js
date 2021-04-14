import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import {Provider} from 'react-redux'
import configureStore from './store/configureStore'
import {startTokenSetUser} from './action/userAction' //Redux signin using token action

const store = configureStore()

const token = localStorage.getItem('x-auth')

if(token!=="undefined"&&token){
  const redirect = () =>{console.log('index token login')}
  store.dispatch(startTokenSetUser(token,redirect))
}

const ele = (
    <Provider store={store}>
        <App />
    </Provider>
)

ReactDOM.render(ele,document.getElementById('root'))