import { render } from "@testing-library/react";
import CompanyList from './CompanyList';

it("matches snapshot", function () {
  const { asFragment } = render(<CompanyList />);
  expect(asFragment()).toMatchSnapshot();
});
