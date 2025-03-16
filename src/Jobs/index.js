import React, { Component } from "react";
import { withRouter, Redirect } from "react-router-dom";
import Cookies from "js-cookie";
import JobItem from "../JobItem";
import { employmentTypesList, salaryRangesList } from "../App";
import "./index.css";

class Jobs extends Component {
  apistatusConstants = {
    initial: "INITIAL",
    success: "SUCCESS",
    inProgress: "IN_PROGRESS",
    failure: "FAILURE",
    empty: "EMPTY",
  };

  state = {
    apiStatus: this.apistatusConstants.initial,
    jobsList: [],
    profileDetails: {},
    employmentType: "",
    minimumPackage: "",
    searchInput: "",
    searchValue: "",
  };

  componentDidMount() {
    this.getProfileDetails();
    this.getJobsList();
  }

  getProfileDetails = async () => {
    this.setState({ apiStatus: this.apistatusConstants.inProgress });
    const jwtToken = Cookies.get("jwt_token");
    const url = "https://apis.ccbp.in/profile";
    const options = {
      method: "GET",
      headers: { Authorization: `Bearer ${jwtToken}` },
    };

    try {
      const response = await fetch(url, options);
      if (response.ok) {
        const data = await response.json();
        this.setState({
          profileDetails: {
            name: data.profile_details.name,
            profileImageUrl: data.profile_details.profile_image_url,
            shortBio: data.profile_details.short_bio,
          },
          apiStatus: this.apistatusConstants.success,
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      this.setState({ apiStatus: this.apistatusConstants.failure });
    }
  };

  getJobsList = async () => {
    this.setState({ apiStatus: this.apistatusConstants.inProgress });
    const jwtToken = Cookies.get("jwt_token");
    const { employmentType, minimumPackage, searchValue } = this.state;
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${minimumPackage}&search=${searchValue}`;
    const options = {
      method: "GET",
      headers: { Authorization: `Bearer ${jwtToken}` },
    };

    try {
      const response = await fetch(url, options);
      if (response.ok) {
        const data = await response.json();
        const updatedData = data.jobs.map((eachJob) => ({
          companyLogoUrl: eachJob.company_logo_url, // Ensure correct property
          employmentType: eachJob.employment_type,
          id: eachJob.id,
          jobDescription: eachJob.job_description,
          location: eachJob.location,
          packagePerAnnum: eachJob.package_per_annum,
          rating: eachJob.rating,
          title: eachJob.title,
        }));

        this.setState({
          jobsList: updatedData,
          apiStatus:
            updatedData.length === 0
              ? this.apistatusConstants.empty
              : this.apistatusConstants.success,
        });
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      this.setState({ apiStatus: this.apistatusConstants.failure });
    }
  };

  handleLogout = () => {
    Cookies.remove("jwt_token");
    this.props.history.push("/login");
  };

  handleEmploymentTypeChange = (employmentType) => {
    this.setState(
      (prevState) => ({
        employmentType:
          prevState.employmentType === employmentType ? "" : employmentType,
      }),
      this.getJobsList
    );
  };

  handleMinPackageChange = (packageValue) => {
    this.setState(
      (prevState) => ({
        minimumPackage:
          prevState.minimumPackage === packageValue ? "" : packageValue,
      }),
      this.getJobsList
    );
  };

  handleSearchInputChange = (event) => {
    this.setState({ searchInput: event.target.value });
  };

  handleSearchSubmit = (event) => {
    event.preventDefault();
    this.setState({ searchValue: this.state.searchInput }, this.getJobsList);
  };

  render() {
    const { apiStatus, jobsList, searchInput } = this.state;
    if (!Cookies.get("jwt_token")) {
      return <Redirect to="/login" />;
    }

    return (
      <div className="header_and_jobs_layout_div">
        <div className="header_div">
          <button
            className="logoutbutton"
            type="button"
            onClick={this.handleLogout}
          >
            Logout
          </button>
        </div>

        <div className="jobs_layout_container">
          <div className="profile_and_other_checkboxes_div">
            <h3>Employment Type</h3>
            {employmentTypesList.map(({ employmentTypeId, label }) => (
              <div key={employmentTypeId}>
                <input
                  type="checkbox"
                  id={employmentTypeId}
                  checked={this.state.employmentType === employmentTypeId}
                  onChange={() =>
                    this.handleEmploymentTypeChange(employmentTypeId)
                  }
                />
                <label htmlFor={employmentTypeId}>{label}</label>
              </div>
            ))}

            <h3>Salary Range</h3>
            {salaryRangesList.map(({ salaryRangeId, label }) => (
              <div key={salaryRangeId}>
                <input
                  type="radio"
                  name="salary"
                  id={salaryRangeId}
                  checked={this.state.minimumPackage === salaryRangeId}
                  onChange={() => this.handleMinPackageChange(salaryRangeId)}
                />
                <label htmlFor={salaryRangeId}>{label}</label>
              </div>
            ))}
          </div>

          <div className="jobs_div">
            <form
              className="searchbar-and-icon-div"
              onSubmit={this.handleSearchSubmit}
            >
              <input
                type="text"
                placeholder="Search..."
                value={searchInput}
                onChange={this.handleSearchInputChange}
              />
              <button type="submit">🔍</button>
            </form>

            <div className="jobslistdiv">
              {apiStatus === this.apistatusConstants.success ? (
                jobsList.length > 0 ? (
                  jobsList.map((job) => (
                    <JobItem key={job.id} carddetails={job} />
                  ))
                ) : (
                  <div className="empty-list-div">
                    <img
                      src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
                      alt="no jobs"
                      className="nojobsfound"
                    />
                    <h1>No Jobs Found</h1>
                    <p>Try different filters</p>
                  </div>
                )
              ) : apiStatus === this.apistatusConstants.inProgress ? (
                <p>Loading...</p>
              ) : (
                <p>Error loading jobs</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Jobs);
