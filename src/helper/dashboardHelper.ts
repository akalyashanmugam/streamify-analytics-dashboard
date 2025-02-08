import { mockUserData, mockMetrics, mockStreamData } from "@/utils/mockData";

// Helper function to get date range
export const getDateRangeFromSelection = (timeRange: string): Date => {
  const today = new Date();
  switch (timeRange) {
    case "7days":
      return new Date(today.setDate(today.getDate() - 7));
    case "30days":
      return new Date(today.setDate(today.getDate() - 30));
    case "90days":
      return new Date(today.setDate(today.getDate() - 90));
    case "1year":
      return new Date(today.setFullYear(today.getFullYear() - 1));
    default:
      return new Date(today.setDate(today.getDate() - 30));
  }
};

// Helper for trend period text
export const getTrendPeriodText = (range: string) => {
  switch (range) {
    case "7days":
      return "last week";
    case "30days":
      return "last month";
    case "90days":
      return "last quarter";
    case "1year":
      return "last year";
    default:
      return "last month";
  }
};

// Helper functions for calculations
export const calculateTotalUsers = (startDate: Date) => {
  const index = mockUserData.findIndex(
    (data) => new Date(data.month) >= startDate
  );
  return mockUserData[mockUserData.length - 1].totalUsers;
};

export const calculateActiveUsers = (streams: typeof mockStreamData) => {
  const uniqueUsers = new Set(streams.map((stream) => stream.userId));
  return uniqueUsers.size;
};

export const calculateRevenue = (streams: typeof mockStreamData) => {
  return streams.reduce((acc, stream) => acc + stream.streamCount * 0.01, 0);
};

export const calculateTopArtist = (streams) => {
  const artistStreams = streams.reduce((acc, stream) => {
    acc[stream.artist] = (acc[stream.artist] || 0) + stream.streamCount;
    return acc;
  }, {});

  return (
    Object.entries(artistStreams).sort(([, a], [, b]) => b - a)[0]?.[0] ||
    mockMetrics.topArtist
  );
};

export const calculateTopSongs = (streams) => {
  const songStreams = streams.reduce((acc, stream) => {
    if (!acc[stream.songName]) {
      acc[stream.songName] = {
        name: stream.songName,
        streams: 0,
        artist: stream.artist,
      };
    }
    acc[stream.songName].streams += stream.streamCount;
    return acc;
  }, {});

  return Object.values(songStreams)
    .sort((a, b) => b.streams - a.streams)
    .slice(0, 5);
};

export const calculateTrend = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
};
