import React, { Component } from "react";

import './footer.css';

class Footer extends Component {
  constructor(props) {
      super(props);
      this.state = {}
  }

  render() {

    return (
      <div className="footer">
        <footer id="large-footer" className="flex-row flex-space-between flex-column-tablet container no-print">
          <div className="hide-from-tablet" style={{ marginBottom: 16 }}>
            <h2>Logo</h2>
            {/* <img src="static/img/logo-black.f44abb4998d1.svg" alt="Screener Logo" style={{ maxWidth: 120 }} className="logo" /> */}
          </div>
          <div className="show-from-tablet" style={{ padding: "0 64px 0 0" }}>
            <h2>Logo</h2>
            {/* <img src="static/img/logo-black.f44abb4998d1.svg" alt="Screener Logo" style={{ maxWidth: 120 }} className="logo" /> */}
            <p className="font-size-19" style={{ fontWeight: 500 }}>Lorem ipsum dolor sit amet</p>
            <p className="sub">xyz Private Ltd &copy; 2020–2021
              <br />
              Made with <i className="icon-heart red"></i> in India.
            </p>
            <p className="sub font-size-13">consectetur adipiscing elit.</p>
            <p className="font-size-13"><a href="guides/terms/index.html">Terms</a> & <a href="guides/privacy/index.html">Privacy</a>.</p>
          </div>
          <div className="flex flex-wrap flex-gap-32 flex-end flex-space-between flex-grow" style={{ maxWidth: 600 }}>
            <div className="flex-grow">
                <div className="title">Product</div>
                <ul className="items">
                    <li>
                        <a href="home/index.html">Home</a>
                    </li>
                    <li>
                        <a href="features/index.html">Features</a>
                    </li>
                    <li>
                        <a href="docs/guides/getting-started/index.html">5 minutes guide</a>
                    </li>
                    <li>
                        <a href="premium/index.html">Premium</a>
                    </li>
                    <li>
                        <a href="docs/changelog/index.html">What's new?</a>
                    </li>
                </ul>
            </div>
            <div className="flex-grow">
                <div className="title">Team</div>
                <ul className="items">
                    <li>
                        <a href="guides/about-us/index.html">About us</a>
                    </li>
                    <li>
                        <a href="support/index.html">Support</a>
                    </li>
                </ul>
            </div>
            {/* <div className="flex-grow">
              <div className="title">Theme</div>
                <ul className="items">
                  <li>
                    <button onClick="SetTheme('light')" aria-label="Set light theme" className="button-plain">
                      <i className="icon-sun"></i>
                      Light
                    </button>
                  </li>
                  <li>
                    <button onClick="SetTheme('dark')" aria-label="Set dark theme" className="button-plain">
                      <i className="icon-moon"></i>
                      Dark
                    </button>
                  </li>
                  <li>
                    <button onClick="SetTheme('auto')" aria-label="Set auto theme" className="button-plain">
                      <i className="icon-monitor"></i>
                      Auto
                    </button>
                  </li>
                </ul>
              </div> */}
            </div>
            <div className="hide-from-tablet">
              <hr />
              <p className="sub">Mittal Analytics Private Ltd &copy; 2009–2020</p>
              <p className="sub">Data provided by C-MOTS Internet Technologies Pvt Ltd</p>
              <p><a href="guides/terms/index.html">Terms</a> & <a href="guides/privacy/index.html">Privacy</a>.</p>
            </div>
          </footer>
        </div>
      )
    }
}

export default Footer;
