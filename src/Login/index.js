import React, { Component } from "react";
import Cookies from "js-cookie";
import { withRouter } from "react-router-dom";
import "./index.css";

const apistatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  inProgress: "INPROGRESS",
};

class Login extends Component {
  state = {
    apistatus: apistatusConstants.initial,
    username: "rahul",
    password: "rahul@2021",
    showErrorMsg: false,
    errorMsg: "",
  };

  changeUsername = (event) => {
    this.setState({ username: event.target.value });
  };

  changePassword = (event) => {
    this.setState({ password: event.target.value });
  };

  submitForm = async (event) => {
    event.preventDefault();
    this.setState({ apistatus: apistatusConstants.inProgress });

    const { username, password } = this.state;
    const url = "/login"; // Proxy will redirect this to `https://apis.ccbp.in/login`

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    };

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const errorData = await response.json();
        this.onsubmitFailed(errorData.error_msg);
        return;
      }

      const data = await response.json();
      this.onsubmitSuccess(data.jwt_token);
    } catch (error) {
      console.error("Error occurred:", error);
      this.onsubmitFailed("Failed to login. Please try again.");
    }
  };

  onsubmitSuccess = (jwtToken) => {
    Cookies.set("jwt_token", jwtToken, { expires: 30, path: "/" });
    this.setState({ apistatus: apistatusConstants.success });
    this.props.history.push("/");
  };

  onsubmitFailed = (errorMsg) => {
    this.setState({ showErrorMsg: true, errorMsg });
  };

  render() {
    const { username, password, showErrorMsg, errorMsg } = this.state;

    return (
      <form onSubmit={this.submitForm} className="formmainimg">
        <div className="formitemdiv">
          <div className="logo-img-heading-div">
            <div className="logo-img-div">
              {/* <img src="img.png" alt="logoimg" className="logo-img" /> */}
              <p>logo img</p>
            </div>
            <div className="logo-heading-div">
              <h1 className="logoheading">JOB-IN</h1>
            </div>
          </div>
          <div className="usernamepassdiv">
            <label className="usernamelabel">
              <p className="usernamepara">USERNAME</p>
              <input
                className="usernameinput"
                type="text"
                value={username}
                onChange={this.changeUsername}
                required
              />
            </label>
            <label className="password-div">
              <p className="password">PASSWORD</p>
              <input
                className="password-name-input"
                type="password"
                value={password}
                onChange={this.changePassword}
                required
              />
            </label>
          </div>
          <div className="buttondiv">
            <button className="loginbuton" type="submit">
              Login
            </button>
            {showErrorMsg && <p className="error-msg">**{errorMsg}**</p>}
          </div>
        </div>
      </form>
    );
  }
}

export default withRouter(Login);
