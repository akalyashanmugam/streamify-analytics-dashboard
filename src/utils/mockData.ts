import {
  MetricsData,
  UserGrowthData,
  RevenueData,
  TopSongData,
  StreamData,
} from "../types";

export const mockMetrics: MetricsData = {
  totalUsers: 152847,
  activeUsers: 98234,
  totalStreams: 15234567,
  revenue: 1150000,
  topArtist: "Luna Echo",
};

export const mockRevenueData: RevenueData[] = [
  { name: "Subscriptions", value: 75000, color: "#0088FE" },
  { name: "Advertisements", value: 25000, color: "#00C49F" },
  { name: "One-time Purchases", value: 15000, color: "#FFBB28" },
];

export const mockTopSongs: TopSongData[] = [
  { name: "Midnight Dreams", streams: 1250000, artist: "Luna Echo" },
  { name: "Dancing in Rain", streams: 980000, artist: "The Rhythm" },
  { name: "Neon Lights", streams: 875000, artist: "Pulse Wave" },
  { name: "Summer Breeze", streams: 760000, artist: "Coastal Vibes" },
  { name: "Electric Heart", streams: 650000, artist: "Synth Masters" },
];

export const mockUserData: UserGrowthData[] = Array.from(
  { length: 24 },
  (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (23 - i)); // Generate 24 months of data for year-over-year comparison
    return {
      month: date.toLocaleString("default", { month: "short" }),
      totalUsers: Math.floor(100000 + i * 2500 + Math.random() * 1000), // Ensure steady growth
      activeUsers: Math.floor(80000 + i * 2000 + Math.random() * 800),
    };
  }
);

export const mockStreamData: StreamData[] = Array.from(
  { length: 1000 },
  (_, i) => {
    const today = new Date();
    const randomDays = Math.floor(Math.random() * 730); // Generate 2 years of data for year-over-year comparison
    const date = new Date(today);
    date.setDate(date.getDate() - randomDays);

    // Generate more realistic stream counts
    const baseStreamCount = 100 + Math.floor(Math.random() * 900);
    const recentMultiplier = Math.max(0.5, 1 - randomDays / 730); // More recent dates have higher stream counts
    const streamCount = Math.floor(baseStreamCount * (1 + recentMultiplier));

    return {
      id: i + 1,
      songName: mockTopSongs[Math.floor(Math.random() * 5)].name,
      artist: mockTopSongs[Math.floor(Math.random() * 5)].artist,
      dateStreamed: date.toISOString().split("T")[0],
      streamCount,
      userId: `USER${Math.floor(Math.random() * 1000) + 1000}`,
    };
  }
);
