import React, { Component } from "react";
import "./registration.css";
class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {}

  render() {

    const { history } = this.props;

    return (
      <main className="registration flex-grow">
        <div className="container">
          <div className="flex flex-space-between flex-column-mobile flex-gap-32">
            <div style={{ maxWidth: 450 }}>
              <h1>Get a free account</h1>

              <p className="larger sub">
                Over 4 lakh investors use Screener for finding and tracking
                stock ideas.
              </p>
            </div>

            <div style={{ maxWidth: 400, minWidth: 300 }}>
              <div
                className="card card-small text-align-center"
                style={{ margin: 0 }}
              >
                <a
                  href="/login/google/"
                  className="flex flex-gap-16 flex-align-center"
                  style={{ justifyContent: "center" }}
                >
                  <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16px"
                    height="16px"
                    viewBox="0 0 48 48"
                  >
                    <g>
                      <path
                        fill="#EA4335"
                        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                      ></path>
                      <path
                        fill="#4285F4"
                        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                      ></path>
                      <path
                        fill="#FBBC05"
                        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                      ></path>
                      <path
                        fill="#34A853"
                        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                      ></path>
                      <path fill="none" d="M0 0h48v48H0z"></path>
                    </g>
                  </svg>
                  <span
                    className="upper ink-900 letter-spacing strong"
                    style={{ fontSize: "1.5rem" }}
                  >
                    Register using Google
                  </span>
                </a>
              </div>

              <div className="flex flex-align-center auth-partition">
                <hr />
                <span className="ink-600">or using email</span>
                <hr />
              </div>

              <form method="post" action="/login/" className="card card-medium">
                <input
                  type="hidden"
                  name="csrfmiddlewaretoken"
                  value="bf6jVkz79vTGwWvMi3kdQxJ1KGffsnuW3AsYQWcbMO3BtxjLEqHPHKYJnf8FAsV5"
                />
                <input type="hidden" name="next" value="" />
                <div className="form-field">
                  <label for="id_username">Email</label>
                  <input
                    type="text"
                    name="username"
                    autofocus=""
                    required=""
                    id="id_username"
                  />
                </div>
                <div className="form-field">
                  <label for="id_username">Confirm Email</label>
                  <input
                    type="text"
                    name="username"
                    autofocus=""
                    required=""
                    id="id_username"
                  />
                </div>

                <div className="form-field">
                  <label for="id_password">Password</label>
                  <input
                    type="password"
                    name="password"
                    required=""
                    id="id_password"
                  />
                </div>

                <button type="submit" className="button-primary">
                  <i className="icon-user"></i>
                  Register
                </button>
              </form>

              <p className="larger" style={{ margin: "1.7rem 0 1rem" }}></p>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default Registration;
