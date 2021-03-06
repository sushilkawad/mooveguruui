import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';

import HomePage from "../pages/homePage";
import TopicDetails from "../pages/topicDetails";

import './routingHolder.css';

class RoutingHolder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    console.log('enter in react router')
    const { history } = this.props;
    const PrivateRoute = ({ component: Component, ...rest }) => (
      <Route
        {...rest}
        render={props => (
            <Component {...props} />
        )
        }
      />
    );

    return (
      <div
        className="routing-holder"
      >
        <Router history={history}>
          <Switch>
            <PrivateRoute
              path="/topicDetails"
              component={() => <TopicDetails history={history} />}
            />
            <PrivateRoute
              path="/"
              exact
              component={() => <HomePage history={history} />}
            />
            {/* <Route path='/'>
              <HomePage history={history}/>
            </Route>
            <Route path='/topicDetails'>
              <TopicDetails history={history}/>
            </Route> */}
          </Switch>
        </Router>
      </div>
    );
  }
}


export default RoutingHolder;
