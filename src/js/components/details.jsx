import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Home from '../modules/home/home';
import pageDescMapper from '../data/pageDescMapper.json';

function Details(props) {
  return (
    <div className='details'>
      <div className='details-header'>
        <div className='details-title'>
          title
        </div>
      </div>
      <div className='details-banner'>
        description
      </div>
      <Switch>
        <Route path="/home" component={Home} />
        <Redirect exact path={`/`} to={`/home`}/>
      </Switch>
    </div>
  );
}

export default Details;
