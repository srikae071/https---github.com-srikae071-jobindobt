import React, { Component } from "react";
import Cookies from "js-cookie";
import { withRouter, Redirect } from "react-router-dom";
import "./index.css";

class Home extends Component {
  onClickLogout = () => {
    const { history } = this.props;
    Cookies.remove("jwt_token");
    history.push("/login");
    const jwtToken = Cookies.get("jwt_token");
    if (jwtToken) {
      history.push("/jobs");
    } else {
      history.push("/login");
    }
  };
  goToJobsPage = () => {
    const { history } = this.props;
    // const jwtToken = Cookies.get("jwt_token");

    history.push("/jobs");
  };

  render() {
    const jwtToken = Cookies.get("jwt_token");

    if (!jwtToken) {
      return <Redirect to="/login" />;
    }

    return (
      <div>
        <div className="headerclass">
          <div className="head-logo-title-div">
            <div className="header-logo-div">
              <img src="img.jpg" alt="logoimg" className="header-logo-img" />
            </div>
            <div className="header-title-div">
              <h1 className="header-title">JOB-IN</h1>
            </div>
          </div>
          <div className="homejobsdiv">
            <p className="homejobsh1">Home</p>
            <p className="homejobsh1" onClick={this.goToJobsPage}>
              Jobs
            </p>
          </div>
          <div className="logoutbtndiv">
            <button
              className="logoutbutton"
              type="button"
              onClick={this.onClickLogout}
            >
              Logout
            </button>
          </div>
        </div>
        <div className="mainbodydiv">
          <div className="discriptionandbuttondiv">
            <div className="headingdiv">
              <h1 className="heading">
                Find The Job That <br /> Fits Your Life but it's in trials
              </h1>
            </div>
            <div className="discriptiondiv">
              <p className="description">
                Millions of people are searching for jobs, salary
                <br />
                information, company reviews. Find the job that fits your
                <br /> abilities and potential.
              </p>
            </div>
            <div className="buttondiv">
              <button
                className="findjobsbutton"
                type="button"
                onClick={this.goToJobsPage}
              >
                Find Jobs
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Home);
