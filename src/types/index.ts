export interface MetricsData {
  totalUsers: number;
  activeUsers: number;
  totalStreams: number;
  revenue: number;
  topArtist: string;
}

export interface StreamData {
  id: number;
  songName: string;
  artist: string;
  dateStreamed: string;
  streamCount: number;
  userId: string;
}

export interface UserGrowthData {
  month: string;
  totalUsers: number;
  activeUsers: number;
}

export interface RevenueData {
  name: string;
  value: number;
  color: string;
}

export interface TopSongData {
  name: string;
  streams: number;
  artist: string;
}

export interface DashboardState {
  selectedTimeRange: "7days" | "30days" | "90days" | "1year";
  selectedRevenueSources: string[];
  filters: {
    search: string;
    dateRange: [Date | null, Date | null];
    artist: string | null;
  };
  sorting: {
    field: keyof StreamData | null;
    direction: "asc" | "desc";
  };
}

export interface DashboardContextType {
  state: DashboardState;
  dispatch: React.Dispatch<DashboardAction>;
  getFilteredData: <T>(data: T[]) => T[];
  getSortedData: <T>(data: T[]) => T[];
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export interface MetricCardProps {
  title: string;
  value: string | number;
  icon: any;
  trend?: number;
  selectedTimeRange: string;
}

export type DashboardAction =
  | { type: "SET_TIME_RANGE"; payload: DashboardState["selectedTimeRange"] }
  | { type: "SET_REVENUE_SOURCES"; payload: string[] }
  | { type: "SET_FILTERS"; payload: Partial<DashboardState["filters"]> }
  | { type: "SET_SORTING"; payload: DashboardState["sorting"] };
