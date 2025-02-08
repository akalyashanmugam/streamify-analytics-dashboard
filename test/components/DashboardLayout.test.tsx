import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DashboardLayout from "../../src/components/layout/DashboardLayout";
import { DashboardProvider } from "../../src/contexts/DashboardContext";

describe("DashboardLayout", () => {
  const renderWithProvider = () => {
    return render(
      <DashboardProvider>
        <DashboardLayout />
      </DashboardProvider>
    );
  };

  test("renders dashboard title", () => {
    renderWithProvider();
    expect(
      screen.getByText("Streamify Analytics Dashboard")
    ).toBeInTheDocument();
  });

  test("renders all metric cards", () => {
    renderWithProvider();
    expect(screen.getByText("Total Users")).toBeInTheDocument();
    expect(screen.getByText("Active Users")).toBeInTheDocument();
    expect(screen.getByText("Total Streams")).toBeInTheDocument();
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("Top Artist")).toBeInTheDocument();
  });

  test("changes time range when clicking time range buttons", () => {
    renderWithProvider();
    const sevenDaysButton = screen.getByText("7days");
    fireEvent.click(sevenDaysButton);
    expect(sevenDaysButton).toHaveClass("bg-blue-600");
  });

  test("renders all charts", () => {
    renderWithProvider();
    expect(screen.getByText("User Growth")).toBeInTheDocument();
    expect(screen.getByText("Revenue Distribution")).toBeInTheDocument();
    expect(screen.getByText("Top 5 Streamed Songs")).toBeInTheDocument();
  });
});
