import React, { createContext, useReducer, useMemo } from "react";
import type {
  DashboardState,
  DashboardAction,
  DashboardContextType,
} from "../types";

const initialState: DashboardState = {
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
};

export const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

const dashboardReducer = (
  state: DashboardState,
  action: DashboardAction
): DashboardState => {
  switch (action.type) {
    case "SET_TIME_RANGE":
      return { ...state, selectedTimeRange: action.payload };
    case "SET_REVENUE_SOURCES":
      return { ...state, selectedRevenueSources: action.payload };
    case "SET_FILTERS":
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case "SET_SORTING":
      return { ...state, sorting: action.payload };
    default:
      return state;
  }
};

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  const value = useMemo(
    () => ({
      state,
      dispatch,
      getFilteredData: <T extends Record<string, any>>(data: T[]): T[] => {
        return data.filter((item) => {
          const matchesSearch = state.filters.search
            ? Object.values(item).some((val) =>
                String(val)
                  .toLowerCase()
                  .includes(state.filters.search.toLowerCase())
              )
            : true;

          const matchesRevenue = state.selectedRevenueSources.length
            ? state.selectedRevenueSources.includes(item.revenueSource)
            : true;

          return matchesSearch && matchesRevenue;
        });
      },
      getSortedData: <T extends Record<string, any>>(data: T[]): T[] => {
        if (!state.sorting.field) return data;

        return [...data].sort((a, b) => {
          const aVal = a[state.sorting.field!];
          const bVal = b[state.sorting.field!];
          const direction = state.sorting.direction === "asc" ? 1 : -1;

          if (typeof aVal === "string") {
            return direction * aVal.localeCompare(bVal);
          }

          return direction * (aVal < bVal ? -1 : 1);
        });
      },
    }),
    [state]
  );

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
