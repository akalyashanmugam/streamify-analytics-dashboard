import React from "react";

interface LoadingSpinnerProps {
  height?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  height = "h-80",
  className = "",
}) => (
  <div className="animate-pulse">
    <div className={`h-80 bg-gray-200 rounded-lg ${height} ${className}`}></div>
  </div>
);

export default LoadingSpinner;
