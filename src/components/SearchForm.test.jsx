import { expect, it } from 'vitest';
import { render } from "@testing-library/react";
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import SearchForm from "./SearchForm";

it("renders without crashing", function () {
  render(
    <MemoryRouter>
      <SearchForm />
    </MemoryRouter>
  );
});

it("matches snapshot", function () {
  const { asFragment } = render(
      <MemoryRouter>
        <SearchForm />
      </MemoryRouter>,
  );
  expect(asFragment()).toMatchSnapshot();
});