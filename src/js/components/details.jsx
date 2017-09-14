import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import AccessToken from '../modules/accessToken/accessToken';
import Introduction from '../modules/introduction/introduction';

function Details(props) {
  return (
      <Switch>
        <Route path="/intro" component={Introduction} />
        <Route path="/accessToken" component={AccessToken} />
        <Redirect exact path={`/`} to={`/intro`}/>
      </Switch>
  );
}

export default Details;
