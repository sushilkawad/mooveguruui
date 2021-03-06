import React, { Component } from 'react';

import './header.css';

class Header extends Component {
    constructor(props){
        super(props);
        this.state={}
    }

    thisOnChange = (e) => {
      console.log(e);
    }

    goToHome = () => {
      console.log('enter in go to home')
      const { history } = this.props;
      history.push('/');
    }

    render() {
      return (
        <div className="header">
          <nav className="u-full-width no-print">
            <div className="top-nav-holder">
              <div className="container">
                <div className="layer-holder top-navigation">
                  <div className="layer flex flex-space-between" style={{alignItems: 'center', height: 50}}>
                    <div className="flex" style={{alignItems: 'center'}}>
                      <a href="index.html" className="logo-holder">
                          <img alt="Screener Logo" className="logo" src="static/img/logo-black.f44abb4998d1.svg" />
                      </a>

                      <div className="show-from-desktop desktop-links" style={{marginLeft: 48}}>
                        <a style={{cursor: 'pointer'}} onClick={this.goToHome}> Home </a>
                        <a href="explore/index.html"> Screens </a>
                        <div className="dropdown-menu">
                          <button className="button-plain">Tools</button>
                          <ul className="dropdown-content flex-column tools-menu" style={{width: 350}} id="nav-tools-menu">
                          <li>
                            <a href="screen/new/index.html" className="flex flex-align-center flex-gap-16">
                              <div className="bg-stripes square-56">
                                  <img src="static/icons/screens.e960a5daedf9.svg" alt="Create a stock screen" />
                              </div>
                              <div>
                                  <div className="font-weight-500 font-size-14">Create a stock screen</div>
                                  <div className="sub font-size-13">Run queries on 10 years of financial data</div>
                              </div>
                            </a>
                          </li>            
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="show-on-mobile mobile-links">
                        <button className="button-plain" onClick="MobileMenu.toggleSearch(this)">
                        <i className="icon-search" style={{fontSize: '1.8rem'}}></i>
                        </button>
                        <div id="mobile-search">
                          <div className="has-addon left-addon dropdown-typeahead">
                              <i className="addon icon-search"></i>
                              <input
                              aria-label="Search for a company"
                              type="search"
                              autoComplete={"off"}
                              spellCheck={false}
                              placeholder="Search for a company"
                              className="u-full-width"
                              onChange={(e) => this.thisOnChange(e)}
                              data-company-search="true" />
                              <ul className="dropdown-content">
                              <li>asdasd</li>
                              </ul>
                          </div>
                        </div>
                    </div>
                    <div className="hide-on-mobile flex flex-gap-16" style={{justifyContent: 'flex-end', flex: '1 1 400px', marginLeft: 48}}>
                      <div className="search">
                          <div className="has-addon left-addon dropdown-typeahead">
                          <i className="addon icon-search"></i>
                          <input
                          aria-label="Search for a company"
                          type="search"
                          autoComplete={"off"}
                          spellCheck={false}
                          placeholder="Search for a company"
                          className="u-full-width"
                          onChange={(e) => this.thisOnChange(e)}

                          data-company-search="true" />
                          <ul className="dropdown-content">
                              <li>asdasd</li>
                          </ul>
                          </div>
                      </div>
                      <div className="flex flex-gap-8 show-from-desktop" style={{margin: 4}}>
                          <a className="button account" href="login/index.html">
                              <i className="icon-user-line blue-icon"></i>
                              Login
                          </a>
                          <a className="button account button-secondary" href="register/index.html">
                              Get free account
                          </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bottom-menu-bar hide-from-desktop flex flex-space-between">
                  <a href="explore/index.html">
                      <i className="icon-screens"></i>
                      <br />
                      Screens
                  </a>
                  <button className="button-plain" onClick="Modal.showInModal('#nav-tools-menu')">
                      <i className="icon-tools"></i>
                      <br />
                      Tools
                  </button>
                  <a href="login/index.html">
                      <i className="icon-user-line"></i>
                      <br />
                      Login
                  </a>
                  <a href="register/index.html">
                      <i className="icon-user-plus"></i>
                      <br />
                      Get account
                  </a>
                </div>
              </div>
            </div>
            <div className="sub-nav-holder">
              <div className="container">
              </div>
            </div>
          </nav>
        </div>
        );
    }
}

export default Header;