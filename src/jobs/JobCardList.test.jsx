import { render } from "@testing-library/react";
import { UserProvider } from "../testUtils";
import JobCardList from "./JobCardList";

// Mock data for testing
const mockJobs = [
  {
    id: 1,
    title: "Software Engineer",
    salary: 100000,
    equity: 0.1,
    companyName: "Acme Inc."
  },
  {
    id: 2,
    title: "Product Manager",
    salary: 90000,
    equity: 0.05,
    companyName: "Tech Corp"
  },
];

// Mock formatSalary function
function formatSalary(salary) {
  const digitsRev = [];
  const salaryStr = salary.toString();

  for (let i = salaryStr.length - 1; i >= 0; i--) {
    digitsRev.push(salaryStr[i]);
    if (i > 0 && i % 3 === 0) digitsRev.push(",");
  }

  return digitsRev.reverse().join("");
}

it("renders a list of job cards with correct data", async () => {
  const { getByText } = render(
    <UserProvider>
      <JobCardList jobs={mockJobs} />
    </UserProvider>
  );

  // check if each job card is rendered with correct data
  mockJobs.forEach(job => {
    const formattedSalary = formatSalary(job.salary);
    expect(getByText(job.title)).toBeInTheDocument();
    expect(getByText(job.companyName)).toBeInTheDocument();
    expect(getByText(`Equity: ${job.equity}`)).toBeInTheDocument();
    expect(getByText(`Salary: ${formattedSalary}`)).toBeInTheDocument();
  });
});