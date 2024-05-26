import { expect, it } from 'vitest';
import { render } from "@testing-library/react";
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import LoadingSpinner from "./LoadingSpinner";

it("renders without crashing", function () {
  render(
    <MemoryRouter>
      <LoadingSpinner />
    </MemoryRouter>
  );
});

it("matches snapshot", function () {
  const { asFragment } = render(
      <MemoryRouter>
        <LoadingSpinner />
      </MemoryRouter>,
  );
  expect(asFragment()).toMatchSnapshot();
});