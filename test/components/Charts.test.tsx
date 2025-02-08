import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { mockUserData, mockRevenueData, mockTopSongs } from "@/utils/mockData";
import UserGrowthChart from "@/components/charts/UserGrowthChart";
import RevenueChart from "@/components/charts/RevenueChart";
import TopSongsChart from "@/components/charts/TopSongsChart";

// Mock recharts components
jest.mock("recharts", () => ({
  ResponsiveContainer: ({ children }) => children,
  LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
  Line: () => null,
  PieChart: ({ children }) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => null,
  BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Cell: () => null,
}));

describe("Chart Components", () => {
  describe("UserGrowthChart", () => {
    test("renders chart and handles hover events", () => {
      const onHover = jest.fn();
      render(<UserGrowthChart data={mockUserData} onHover={onHover} />);

      const chart = screen.getByTestId("line-chart");
      expect(chart).toBeInTheDocument();

      fireEvent.mouseOver(chart);
      expect(onHover).toHaveBeenCalled();
    });
  });

  describe("RevenueChart", () => {
    test("renders chart and handles click events", () => {
      const onClick = jest.fn();
      render(<RevenueChart data={mockRevenueData} onClick={onClick} />);

      const chart = screen.getByTestId("pie-chart");
      expect(chart).toBeInTheDocument();

      fireEvent.click(chart);
      expect(onClick).toHaveBeenCalled();
    });
  });

  describe("TopSongsChart", () => {
    test("renders chart with correct data", () => {
      render(<TopSongsChart data={mockTopSongs} />);
      const chart = screen.getByTestId("bar-chart");
      expect(chart).toBeInTheDocument();
    });
  });
});
