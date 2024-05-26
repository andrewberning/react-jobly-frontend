import { render, screen } from "@testing-library/react";
import App from './App';

describe('App', () => {
  it("should render App component", async () => {
    render(<App />);
    expect(await screen.findByText('Login')).toBeInTheDocument();

    screen.debug();
  });  
})
