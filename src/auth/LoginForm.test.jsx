import { expect, it } from 'vitest';
import { render } from "@testing-library/react";
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import LoginForm from "./LoginForm"

it("renders without crashing", function () {
  render(
    <MemoryRouter>
      <LoginForm />
    </MemoryRouter>
  );
});

it("matches snapshot", function () {
  const { asFragment } = render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
  );
  expect(asFragment()).toMatchSnapshot();
});