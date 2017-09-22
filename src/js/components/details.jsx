import React from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import UserInfo from '../modules/userInfo';
import Introduction from '../modules/introduction/introduction';

const Details = () => {
    return (
        <div className='details'>
            <Switch>
                <Route path='/intro' component={Introduction}/>
                <Route path='/userInfo' component={UserInfo}/>
                <Redirect exact path='/' to='/intro'/>
            </Switch>
        </div>
    );
};

export default Details;
