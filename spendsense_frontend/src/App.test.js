import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders SpendSense shell", () => {
  render(<App />);
  // Brand appears both in sidebar and topnav; asserting existence is enough.
  const brand = screen.getAllByText(/SpendSense/i);
  expect(brand.length).toBeGreaterThan(0);
});
