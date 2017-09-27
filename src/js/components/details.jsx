import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import UserInfo from '../modules/userInfo';
import Introduction from '../modules/introduction';
import InstrumentDetails from '../modules/instrumentDetails';
import InfoPrices from '../modules/infoPrices';

function Details(props) {
    return (
        <div className='details'>
            <Switch>
                <Route path='/intro' component={Introduction}/>
                <Route path='/userInfo' component={UserInfo}/>
                <Route path='/instruments' component={InstrumentDetails}/>
                <Route path='/infoPrices' component={InfoPrices}/>
                <Redirect exact path='/' to='/intro' />
            </Switch>
        </div>
    );
}

export default Details;
