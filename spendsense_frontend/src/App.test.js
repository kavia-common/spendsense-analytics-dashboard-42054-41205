import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders standalone login when signed out", () => {
  render(<App />);
  expect(screen.getByText(/Sign in/i)).toBeInTheDocument();
});
