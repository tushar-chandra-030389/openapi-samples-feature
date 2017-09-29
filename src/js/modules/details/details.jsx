import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import UserInfo from '../userInfo';
import Introduction from '../introduction';
import InstrumentDetails from '../instrumentDetails';
import InfoPrices from '../infoPrices';
import Prices from '../prices';
import ClientPortfolio from '../clientPortfolio';
import OptionChain from '../optionChain';
import ChartPolling from '../charts';
import Orders from '../orders';

function Details(props) {
    return (
        <div className='details'>
            <Switch>
                <Route path='/intro' component={(routeProps) => <Introduction {...props} {...routeProps}/>}/>
                <Route path='/userInfo' component={(routeProps) => <UserInfo {...props} {...routeProps}/>}/>
                <Route path='/instruments' component={(routeProps) => <InstrumentDetails {...props} {...routeProps}/>}/>
                <Route path='/infoPrices' component={(routeProps) => <InfoPrices  {...props} {...routeProps}/>}/>
                <Route path='/prices' component={(routeProps) => <Prices {...props} {...routeProps} />}/>
                <Route path='/clientPortfolio'
                       component={(routeProps) => <ClientPortfolio {...props} {...routeProps} />}/>
                <Route path='/options' component={(routeProps) => <OptionChain {...props} {...routeProps}/>}/>
                <Route path='/chartPolling' component={(routeProps) => <ChartPolling {...props} {...routeProps}/>}/>
                <Route path='/orders' component={(routeProps) => <Orders {...props} {...routeProps}/>}/>
                <Redirect exact path='/' to='/intro'/>
            </Switch>
        </div>
    );
}

export default Details;
