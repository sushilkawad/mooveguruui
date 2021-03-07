import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import HomePage from "../pages/homePage";
import Login from "../pages/login";
import TopicDetails from "../pages/topicDetails";

// import Header from '../component/header';
// import Footer from "../component/footer";
import './routingHolder.css';

class RoutingHolder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

// componentDidMount(){
//   console.log('ccccc');
// }


// componentWillUpdate(){  
//   console.log('uuu')
// }

// componentWillReceiveProps(){  
//   console.log('nnnn')
// }

// static getDerivedStateFromProps(){

//   console.log('ggggg')
// }

  render() {
    console.log('enter in react router',this.props)
    const { history, routeChanged } = this.props;
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
        <BrowserRouter history={history}>
        {/* <Header history={history} /> */}
          <Switch>
            <PrivateRoute
              path="/topicDetails"
              component={() => <TopicDetails history={history} routeChanged={routeChanged} />}
              // component={withRouter(TopicDetails)}
              />
              <Route
                path="/login"
                exact
                component={() => <Login history={history} />}
                // component={Login}
              />
            <PrivateRoute
              path="/"
              exact
              // component={() => <HomePage history={history} />}
              component={HomePage}
            />
            {/* <Route path='/'>
              <HomePage history={history}/>
              </Route>
              <Route path='/topicDetails'>
              <TopicDetails history={history}/>
            </Route> */}
          </Switch>
            {/* <Footer history={history} /> */}
        </BrowserRouter>
      </div>
    );
  }
}


export default RoutingHolder;
