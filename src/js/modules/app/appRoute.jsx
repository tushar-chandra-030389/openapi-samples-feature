import React from 'react';
import {render} from 'react-dom';
import {HashRouter as Router, Route, Switch} from 'react-router-dom';
import App from './app';

const AppRoute = () => {
    return (
        <Router>
            <Route path='/' component={App}/>
        </Router>
    );
};

export default AppRoute;
