import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import UserInfo from 'src/js/modules/userInfo';
import Introduction from 'src/js/modules/introduction';
import InstrumentDetails from 'src/js/modules/instrumentDetails';
import InfoPrices from 'src/js/modules/infoPrices';
import Prices from 'src/js/modules/prices';
import ClientPortfolio from 'src/js/modules/clientPortfolio';
import OptionChain from 'src/js/modules/optionChain';
import ChartPolling from 'src/js/modules/charts';
import Orders from 'src/js/modules/orders';

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
