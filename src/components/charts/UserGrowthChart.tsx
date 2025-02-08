import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { UserGrowthData } from "../../types";

interface UserGrowthChartProps {
  data: UserGrowthData[];
  onHover?: (data: any) => void;
}

const UserGrowthChart: React.FC<UserGrowthChartProps> = ({ data, onHover }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} onMouseMove={onHover}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="totalUsers"
          stroke="#8884d8"
          name="Total Users"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="activeUsers"
          stroke="#82ca9d"
          name="Active Users"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default UserGrowthChart;
