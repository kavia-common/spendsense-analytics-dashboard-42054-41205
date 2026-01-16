import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders SpendSense dashboard shell", () => {
  render(<App />);
  const brand = screen.getByText(/SpendSense/i);
  expect(brand).toBeInTheDocument();
});
