import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import loaderReducer from './modules/loader/reducer';
import errorReducer from './modules/error/reducer';
import userInfoReducer from './modules/userInfo/reducer';
import AppRoute from './modules/app';

// css
import 'src/css';

const reducer = combineReducers({
    loader: loaderReducer,
    error: errorReducer,
    userInfo: userInfoReducer,
});
const store = createStore(reducer, applyMiddleware(thunk));

// eslint-disable-next-line no-undef
if (IS_DEV_ENV) {
    window.$store = store;
}

render(
    <Provider store={store}>
        <AppRoute/>
    </Provider>,
    document.getElementById('container')
);
