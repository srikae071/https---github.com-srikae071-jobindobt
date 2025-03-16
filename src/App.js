import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./Login";
import Home from "./Home";
import Jobs from "./Jobs";
import JobItem from "./JobItem";
import JobItemDetails from "./JobItemDetails";
import "./App.css";

// Exporting employment and salary lists
export const employmentTypesList = [
  {
    label: "Full Time",
    employmentTypeId: "FULLTIME",
  },
  {
    label: "Part Time",
    employmentTypeId: "PARTTIME",
  },
  {
    label: "Freelance",
    employmentTypeId: "FREELANCE",
  },
  {
    label: "Internship",
    employmentTypeId: "INTERNSHIP",
  },
];

export const salaryRangesList = [
  {
    salaryRangeId: "1000000",
    label: "10 LPA and above",
  },
  {
    salaryRangeId: "2000000",
    label: "20 LPA and above",
  },
  {
    salaryRangeId: "3000000",
    label: "30 LPA and above",
  },
  {
    salaryRangeId: "4000000",
    label: "40 LPA and above",
  },
];

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/login" component={Login} />
      <Route exact path="/" component={Home} />
      <Route exact path="/jobs" component={Jobs} />
      <Route exact path="/jobs/:id" component={JobItem} />
      <Route eaxt path="/jobs/:id" component={JobItemDetails} />
      {/* <Route path="/not-found" component={NotFound} /> */}
      {/* <Redirect to="not-found" /> */}
    </Switch>
  </BrowserRouter>
);

export default App;
