import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import Login from '../containers/Authentication/Login';
import Register from '../containers/Authentication/Register';
import Account from '../containers/Authentication/Account';
import Game from '../containers/Game';
import browserHistory from '../helpers/history';

function App() {
  return (
    <Router history={browserHistory}>
      <div>
        <Switch>
          <Route path="/" exact component={Game} />
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/account" component={Account} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
