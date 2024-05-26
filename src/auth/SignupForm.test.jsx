import { expect, it } from 'vitest';
import { render } from "@testing-library/react";
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import SignupForm from "./SignupForm"

it("renders without crashing", function () {
  render(
    <MemoryRouter>
      <SignupForm />
    </MemoryRouter>
  );
});

it("matches snapshot", function () {
  const { asFragment } = render(
      <MemoryRouter>
        <SignupForm />
      </MemoryRouter>,
  );
  expect(asFragment()).toMatchSnapshot();
});