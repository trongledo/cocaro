import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from './Authentication/Login';
import Register from './Authentication/Register';
import Game from '../containers/Game';

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/" exact component={Game} />
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
