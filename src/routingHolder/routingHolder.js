import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import HomePage from "../pages/homePage";
import Login from "../pages/login";
import Registration from "../pages/registration";
import TopicDetails from "../pages/topicDetails";

import Header from '../component/header';
// import Footer from "../component/footer";
import './routingHolder.css';

class RoutingHolder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      changedRoute:false
    }
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

routeChanged = (r) => {
  this.setState({changedRoute:r});
}

shouldComponentUpdate(props,state) {
  // console.log(state);
  // console.log(props);
  // console.log(this.state);
  // console.log(this.props);
  if(state.changedRoute != this.state.changedRoute){
    return true;
  }
  return false;
}

  render() {
    console.log('enter in react router',this.props)
    const { history } = this.props;
    const { changedRoute } = this.state;
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
        <BrowserRouter history={history} >
        <Header history={history} routeChanged={changedRoute} routeChangedFunction={this.routeChanged} />
          <Switch>
            <PrivateRoute
              path="/topicDetails"
              component={() => <TopicDetails history={history} routeChangedFunction={this.routeChanged} />}
              // component={withRouter(TopicDetails)}
              />
              <PrivateRoute
                path="/login"
                exact
                component={() => <Login history={history} />}
                // component={Login}
              />
              <PrivateRoute
                path="/registration"
                exact
                component={() => <Registration history={history} />}
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
