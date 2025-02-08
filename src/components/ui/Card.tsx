import React from "react";
import { getTrendPeriodText } from "@/helper/dashboardHelper";
import { CardProps, MetricCardProps } from "@/types";

export const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-md ${className}`}>{children}</div>
);

export const CardHeader: React.FC<CardProps> = ({
  children,
  className = "",
}) => <div className={`p-4 border-b ${className}`}>{children}</div>;

export const CardTitle: React.FC<CardProps> = ({
  children,
  className = "",
}) => <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>;

export const CardContent: React.FC<CardProps> = ({
  children,
  className = "",
}) => <div className={`p-4 ${className}`}>{children}</div>;

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  selectedTimeRange,
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">
        {typeof value === "number" ? value.toLocaleString() : value}
      </div>
      {trend !== undefined && (
        <p
          className={`text-xs ${
            trend > 0
              ? "text-green-600"
              : trend < 0
              ? "text-red-600"
              : "text-gray-600"
          }`}
        >
          {trend > 0 ? "+" : ""}
          {trend}% from {getTrendPeriodText(selectedTimeRange)}
        </p>
      )}
    </CardContent>
  </Card>
);
