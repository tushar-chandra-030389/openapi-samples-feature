import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import App from './app';

function AppRoute() {
    return (
        <Router>
            <Route path="/" component={App}/>
        </Router>
    );
}

export default AppRoute;
