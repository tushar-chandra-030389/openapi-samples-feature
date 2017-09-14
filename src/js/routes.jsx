import React from 'react';
import { render } from 'react-dom';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import App from './modules/app';

//css
import '../css/style.css';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

const Routes = () => (
  <Router>
    <Route path="/" component={App} />
  </Router>
);
render(<Routes />, document.getElementById('container'));
