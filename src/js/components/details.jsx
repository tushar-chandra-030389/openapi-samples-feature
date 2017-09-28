import React from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import UserInfo from '../modules/userInfo';
import Introduction from '../modules/introduction';
import InstrumentDetails from '../modules/instrumentDetails';
import InfoPrices from '../modules/infoPrices';
import Prices from '../modules/prices';
import ClientPortfolio from '../modules/clientPortfolio';
import OptionChain from '../modules/optionChain';

function Details() {
    return (
        <div className='details'>
            <Switch>
                <Route path='/intro' component={Introduction}/>
                <Route path='/userInfo' component={UserInfo}/>
                <Route path='/instruments' component={InstrumentDetails}/>
                <Route path='/infoPrices' component={InfoPrices}/>
                <Route path='/prices' component={Prices}/>
                <Route path='/clientPortfolio' component={ClientPortfolio}/>
                <Route path='/options' component={OptionChain}/>
                <Redirect exact path='/' to='/intro' />
            </Switch>
        </div>
    );
}

export default Details;
