import React, { Component } from "react";
import { createBrowserHistory }  from 'history';

import RoutingHolder from "./routingHolder";
import Header from './component/header/header';
import Footer from "./component/footer/footer";

const history = createBrowserHistory();
class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      changedRoute:false
    }
  }

  
// componentDidMount(){
//   console.log('111');
// }

// componentWillUpdate(){  
//   console.log('222')
// }

// shouldComponentUpdate(){  
//   console.log('ssss')
// }

// componentWillReceiveProps(){  
//   console.log('333')
// }

// static getDerivedStateFromProps(){
//   console.log('444')
// }
  
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
    const { changedRoute } = this.state;
    console.log('enter in app');
    return ( 
      <div>
        {/* <Header history={history} routeChanged={changedRoute} /> */}
        <RoutingHolder history={history} />
        <Footer history={history} />
      </div>
    )
  }
}

export default App;
