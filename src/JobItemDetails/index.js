import React, { Component } from "react";
import Cookies from "js-cookie";

const ApiStatusConstants = {
  initial: "INITIAL",
  inProgress: "IN_PROGRESS",
  success: "SUCCESS",
  failure: "FAILURE",
};

class JobItemDetails extends Component {
  state = {
    jobItemData: {},
    jobItemSkills: [],
    similarJobs: [],
    apiStatus: ApiStatusConstants.initial,
    applied: false,
  };

  componentDidMount() {
    this.getJobItemData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.getJobItemData();
    }
  }

  getJobItemData = async () => {
    const { id } = this.props.match.params;
    this.setState({ apiStatus: ApiStatusConstants.inProgress });

    const jwtToken = Cookies.get("jwt_token");
    const url = `https://apis.ccbp.in/jobs/${id}`;
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    };

    try {
      const response = await fetch(url, options);
      if (response.ok) {
        const data = await response.json();
        const updatedJobDescription = data.job_details;

        this.setState({
          jobItemSkills: updatedJobDescription.skills,
          jobItemData: updatedJobDescription,
          apiStatus: ApiStatusConstants.success,
          similarJobs: data.similar_jobs,
        });
      } else {
        this.setState({ apiStatus: ApiStatusConstants.failure });
      }
    } catch (error) {
      console.error("Error occurred while fetching job details:", error);
      this.setState({ apiStatus: ApiStatusConstants.failure });
    }
  };

  onClickLogout = () => {
    Cookies.remove("jwt_token");
    this.props.history.push("/login");
  };

  render() {
    const { jobItemData, jobItemSkills, similarJobs, apiStatus, applied } =
      this.state;

    const header = <div className="headerclass">{/*  header JSX */}</div>;

    const similarJobSection = (
      <div className="similar-jobs-section-div">
        {/*  similar jobs section JSX */}
      </div>
    );

    const jobSummary = (
      <div className="main-black-background">{/*job summary JSX */}</div>
    );

    const isLoading = (
      <div className="loading-spinner-div">{/*  loading spinner JSX */}</div>
    );

    switch (apiStatus) {
      case ApiStatusConstants.inProgress:
        return isLoading;
      case ApiStatusConstants.success:
        return (
          <div>
            {header}

            {similarJobSection}
          </div>
        );
      case ApiStatusConstants.failure:
        return <h2>Failed to load job details</h2>;
      default:
        return null;
    }
  }
}

export default JobItemDetails;
