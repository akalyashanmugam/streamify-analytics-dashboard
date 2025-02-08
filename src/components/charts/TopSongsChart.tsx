import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { TopSongData } from "../../types";

interface TopSongsChartProps {
  data: TopSongData[];
}

const TopSongsChart: React.FC<TopSongsChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="streams" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TopSongsChart;
