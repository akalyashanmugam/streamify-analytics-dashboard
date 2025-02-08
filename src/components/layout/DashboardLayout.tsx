import React, { Suspense, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Users, Music, DollarSign, Crown, TrendingUp } from "lucide-react";
import { useDashboard } from "../../hooks/useDashboard";
import LoadingSpinner from "../common/LoadingSpinner";
import {
  mockUserData,
  mockRevenueData,
  mockStreamData,
} from "../../utils/mockData";
import StreamsTable from "../tables/StreamsTable";
import RevenueChart from "../charts/RevenueChart";
import TopSongsChart from "../charts/TopSongsChart";
import UserGrowthChart from "../charts/UserGrowthChart";
import { MetricCard } from "../ui/Card";
import {
  getDateRangeFromSelection,
  calculateActiveUsers,
  calculateRevenue,
  calculateTopArtist,
  calculateTopSongs,
  calculateTrend,
} from "@/helper/dashboardHelper";
import { DATE_RANGES } from "@/utils/constants";

const DashboardLayout = () => {
  const { state, dispatch } = useDashboard();
  const [selectedTimeRange, setSelectedTimeRange] = useState("30days");
  const [activeTooltip, setActiveTooltip] = useState(null);

  const filteredData = useMemo(() => {
    const startDate = getDateRangeFromSelection(selectedTimeRange);
    const previousStartDate = new Date(startDate);

    // For calculating trends, set previous period
    switch (selectedTimeRange) {
      case "7days":
        previousStartDate.setDate(previousStartDate.getDate() - 7);
        break;
      case "30days":
        previousStartDate.setDate(previousStartDate.getDate() - 30);
        break;
      case "90days":
        previousStartDate.setDate(previousStartDate.getDate() - 90);
        break;
      case "1year":
        previousStartDate.setFullYear(previousStartDate.getFullYear() - 1);
        break;
    }

    // Filter stream data by date and search term
    const filteredStreams = mockStreamData.filter((item) => {
      const itemDate = new Date(item.dateStreamed);
      const isWithinDateRange = itemDate >= startDate;
      const matchesSearch =
        !state.filters.search ||
        item.songName
          .toLowerCase()
          .includes(state.filters.search.toLowerCase()) ||
        item.artist.toLowerCase().includes(state.filters.search.toLowerCase());
      return isWithinDateRange && matchesSearch;
    });

    // Get previous period streams for trend calculation
    const previousPeriodStreams = mockStreamData.filter((item) => {
      const itemDate = new Date(item.dateStreamed);
      return itemDate >= previousStartDate && itemDate < startDate;
    });

    // Calculate metrics with trends
    const currentMetrics = {
      totalStreams: filteredStreams.length,
      revenue: calculateRevenue(filteredStreams),
      activeUsers: calculateActiveUsers(filteredStreams),
    };

    const previousMetrics = {
      totalStreams: previousPeriodStreams.length,
      revenue: calculateRevenue(previousPeriodStreams),
      activeUsers: calculateActiveUsers(previousPeriodStreams),
    };

    // Calculate trends
    const trends = {
      totalStreams: calculateTrend(
        currentMetrics.totalStreams,
        previousMetrics.totalStreams
      ),
      revenue: calculateTrend(currentMetrics.revenue, previousMetrics.revenue),
      activeUsers: calculateTrend(
        currentMetrics.activeUsers,
        previousMetrics.activeUsers
      ),
    };

    // Filter user growth data
    const monthsToShow =
      selectedTimeRange === "7days"
        ? 1
        : selectedTimeRange === "30days"
        ? 3
        : selectedTimeRange === "90days"
        ? 6
        : 12;

    const filteredUserData = mockUserData.slice(-monthsToShow);

    return {
      streams: filteredStreams,
      metrics: {
        ...currentMetrics,
        topArtist: calculateTopArtist(filteredStreams),
        totalUsers: filteredUserData[filteredUserData.length - 1].totalUsers,
      },
      trends,
      userData: filteredUserData,
      topSongs: calculateTopSongs(filteredStreams),
    };
  }, [selectedTimeRange, state.filters.search]);

  // Event handlers
  const handleTimeRangeChange = (range) => {
    setSelectedTimeRange(range);
    dispatch({ type: "SET_TIME_RANGE", payload: range });
  };

  const handlePieChartClick = (data) => {
    dispatch({
      type: "SET_REVENUE_SOURCES",
      payload: [data.name],
    });
  };

  const handleChartHover = (data) => {
    setActiveTooltip(data);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Streamify Analytics Dashboard</h1>
          <div className="mt-4 flex gap-4">
            {DATE_RANGES.map((range) => (
              <button
                key={range}
                onClick={() => handleTimeRangeChange(range)}
                className={`px-4 py-2 rounded-lg ${
                  selectedTimeRange === range
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </header>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <MetricCard
            title="Total Users"
            value={filteredData.metrics.totalUsers}
            icon={Users}
            trend={filteredData.trends.activeUsers}
            selectedTimeRange={selectedTimeRange}
          />
          <MetricCard
            title="Active Users"
            value={filteredData.metrics.activeUsers}
            icon={Users}
            trend={filteredData.trends.activeUsers}
            selectedTimeRange={selectedTimeRange}
          />
          <MetricCard
            title="Total Streams"
            value={filteredData.metrics.totalStreams}
            icon={Music}
            trend={filteredData.trends.totalStreams}
            selectedTimeRange={selectedTimeRange}
          />
          <MetricCard
            title="Revenue"
            value={`$${Math.round(
              filteredData.metrics.revenue
            ).toLocaleString()}`}
            icon={DollarSign}
            trend={filteredData.trends.revenue}
            selectedTimeRange={selectedTimeRange}
          />
          <MetricCard
            title="Top Artist"
            value={filteredData.metrics.topArtist}
            icon={Crown}
            selectedTimeRange={selectedTimeRange}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          <Suspense fallback={<LoadingSpinner />}>
            <Card className="p-4">
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <UserGrowthChart
                  data={filteredData.userData}
                  onHover={handleChartHover}
                />
              </CardContent>
            </Card>
          </Suspense>

          <Suspense fallback={<LoadingSpinner />}>
            <Card className="p-4">
              <CardHeader>
                <CardTitle>Revenue Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <RevenueChart
                  data={mockRevenueData}
                  onClick={handlePieChartClick}
                />
              </CardContent>
            </Card>
          </Suspense>

          <Suspense fallback={<LoadingSpinner />}>
            <Card className="p-4 lg:col-span-2">
              <CardHeader>
                <CardTitle>Top 5 Streamed Songs</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <TopSongsChart data={filteredData.topSongs} />
              </CardContent>
            </Card>
          </Suspense>
        </div>

        {/* Data Table */}
        <Suspense fallback={<LoadingSpinner />}>
          <Card className="p-4">
            <CardHeader>
              <CardTitle>Recent Streams</CardTitle>
            </CardHeader>
            <CardContent>
              <StreamsTable
                data={filteredData.streams}
                searchValue={state.filters.search}
                onSearch={(value) =>
                  dispatch({
                    type: "SET_FILTERS",
                    payload: { search: value },
                  })
                }
              />
            </CardContent>
          </Card>
        </Suspense>
      </div>
    </div>
  );
};

export default DashboardLayout;
