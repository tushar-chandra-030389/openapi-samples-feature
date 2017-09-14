import React from 'react';
import { render } from 'react-dom';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

// components
import App from './modules/app';

//css
import '../css/style.css';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';


/*import { Router, Route, hashHistory, IndexRedirect } from 'react-router';
import App from './modules/app/app';
import Introduction from './modules/introduction/Introduction';
import Home from './components/Home';
import InfoPrices from './components/trade/infoprices/InfoPrices';
import Prices from './components/trade/prices/Prices';
import OptionChain from './components/trade/optionchain/OptionChain';
import Order from './components/trade/orders/Order';
import Instruments from './components/ref/instruments/InstrumentDetails';
import ClientPortfolio from './components/portfolio/clientPortfolio/ClientPortfolio';
import ChartPolling from './components/chart/chartPolling/ChartPolling';
import ChartStreaming from './components/chart/chartStreaming/ChartStreaming';
import Onboarding from './components/onboarding/Onboarding';
import AccountOverview from './components/portfolio/AccountOverview';*/


/*const Routes = () => (
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRedirect to="/intro" />
      <Route path="home" component={Home} />
      <Route path="intro" component={Introduction} />
      <Route path="infoPrices" component={InfoPrices} />
      <Route path="prices" component={Prices} />
      <Route path="options" component={OptionChain} />
      <Route path="orders" component={Order} />
      <Route path="instruments" component={Instruments} />
      <Route path="clientPortfolio" component={ClientPortfolio} />
      <Route path="accountOverview" component={AccountOverview} />
      <Route path="chartPolling" component={ChartPolling} />
      <Route path="chartStreaming" component={ChartStreaming} />
      <Route path="onboarding" component={Onboarding} />
    </Route>
  </Router>
);*/

const Routes = () => (
    <div>
        <Router>
            <Route exact path="/" component={App} />
        </Router>
    </div>
);
render(<Routes/>, document.getElementById('container'));
