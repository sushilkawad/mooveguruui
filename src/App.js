import React, { Component } from "react";
import { createBrowserHistory }  from 'history';

import RoutingHolder from "./routingHolder";
import Header from './component/header/header';
import Footer from "./component/footer/footer";

const history = createBrowserHistory();
class App extends Component {
  constructor(props){
    super(props);
  }

  render() {
    console.log('enter in app');
    return ( 
      <div>
        <Header history={history} />
        <RoutingHolder history={history} />
        <Footer history={history} />
      </div>
    )
  }
}

export default App;
