import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import loaderReducer from './modules/loader/reducer';
import userInfoReducer from './modules/userInfo/reducer';
import AppRoute from './modules/app';

//css
import '../css/style.css';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

const reducer = combineReducers({
    loader: loaderReducer,
    userInfo: userInfoReducer,
});
const store = createStore(reducer, applyMiddleware(thunk));

render(
    <Provider store={store}>
        <AppRoute />
    </Provider>,
    document.getElementById('container')
);
