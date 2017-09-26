import React from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import UserInfo from '../modules/userInfo';
import Introduction from '../modules/introduction';
import InstrumentDetails from '../modules/instrumentDetails';
import Prices from '../modules/prices';
import ClientPortfolio from '../modules/clientPortfolio';

function Details() {
    return (
        <div className='details'>
            <Switch>
                <Route path='/intro' component={Introduction}/>
                <Route path='/userInfo' component={UserInfo}/>
                <Route path='/instruments' component={InstrumentDetails}/>
                <Route path='/prices' component={Prices}/>
                <Route path='/clientPortfolio' component={ClientPortfolio}/>
                <Redirect exact path='/' to='/intro'/>
            </Switch>
        </div>
    );
}

export default Details;
