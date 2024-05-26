import { useState, useEffect } from "react";
import SearchForm from "../components/SearchForm";
import JobCardList from "./JobCardList";
import JoblyApi from "../api/api";
import LoadingSpinner from "../components/LoadingSpinner";

/** Show page with list of jobs.
 *
 * On mount, loads jobs from API.
 * Re-loads filtered jobs on submit from search form.
 *
 * JobList -> JobCardList -> JobCard
 *
 * This is routed to at /jobs
 */

export default function JobList() {
  const [jobs, setJobs] = useState(null);

  useEffect(function getAllJobsOnMount() {
    search();
  }, []);

  /** Triggered by search form submit; reloads jobs. */
  async function search(title) {
    let jobs = await JoblyApi.getJobs(title);
    setJobs(jobs);
  }

  if(!jobs) return <LoadingSpinner />;

  return (
    <div className="JobList col-md-8 offset-md-2">
      <SearchForm searchFor={search} />
      {jobs.length
          ? <JobCardList jobs={jobs} />
          : <p className="lead">Sorry, no results were found!</p>
      }
    </div>
  );
}