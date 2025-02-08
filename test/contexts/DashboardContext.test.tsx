import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react-hooks";
import { DashboardProvider } from "../../src/contexts/DashboardContext";
import { useDashboard } from "../../src/hooks/useDashboard";

describe("DashboardContext", () => {
  const wrapper = ({ children }) => (
    <DashboardProvider>{children}</DashboardProvider>
  );

  test("provides initial state", () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });

    expect(result.current.state).toEqual({
      selectedTimeRange: "30days",
      selectedRevenueSources: [],
      filters: {
        search: "",
        dateRange: [null, null],
        artist: null,
      },
      sorting: {
        field: null,
        direction: "asc",
      },
    });
  });

  test("updates time range", () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });

    act(() => {
      result.current.dispatch({
        type: "SET_TIME_RANGE",
        payload: "7days",
      });
    });

    expect(result.current.state.selectedTimeRange).toBe("7days");
  });

  test("filters data correctly", () => {
    const { result } = renderHook(() => useDashboard(), { wrapper });
    const testData = [
      { id: 1, name: "Test 1" },
      { id: 2, name: "Test 2" },
      { id: 3, name: "Other" },
    ];

    act(() => {
      result.current.dispatch({
        type: "SET_FILTERS",
        payload: { search: "Test" },
      });
    });

    const filteredData = result.current.getFilteredData(testData);
    expect(filteredData).toHaveLength(2);
  });
});
