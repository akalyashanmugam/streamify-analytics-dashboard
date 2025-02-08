import React, { useState } from "react";
import { FixedSizeList } from "react-window";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}

interface StreamsTableProps {
  data: any[];
  searchValue: string;
  onSearch: (value: string) => void;
}

const HEADER_HEIGHT = 40;
const ROW_HEIGHT = 48;
const COLUMNS = [
  { key: "songName", label: "Song Name", width: "25%" },
  { key: "artist", label: "Artist", width: "20%" },
  { key: "dateStreamed", label: "Date Streamed", width: "20%" },
  { key: "streamCount", label: "Stream Count", width: "15%" },
  { key: "userId", label: "User ID", width: "20%" },
];

const StreamsTable: React.FC<StreamsTableProps> = ({
  data,
  searchValue,
  onSearch,
}) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "",
    direction: "asc",
  });

  const handleSort = (key: string) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortedData = () => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (sortConfig.key === "streamCount") {
        return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
      }

      if (sortConfig.key === "dateStreamed") {
        return sortConfig.direction === "asc"
          ? new Date(aVal).getTime() - new Date(bVal).getTime()
          : new Date(bVal).getTime() - new Date(aVal).getTime();
      }

      return sortConfig.direction === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });
  };

  const sortedData = getSortedData();

  const Row = ({ index, style }) => {
    const item = sortedData[index];
    return (
      <div
        style={{
          ...style,
          display: "flex",
          width: "100%",
          minWidth: "800px", // Ensures minimum width for content
        }}
        className="border-b border-gray-200 hover:bg-gray-50"
      >
        {COLUMNS.map(({ key, width }) => (
          <div
            key={key}
            style={{ width }}
            className={`px-6 py-3 flex items-center ${
              key === "streamCount" ? "justify-end" : "justify-start"
            }`}
          >
            <span className="truncate">
              {key === "streamCount" ? item[key].toLocaleString() : item[key]}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortConfig.key !== column) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by song or artist..."
          className="w-full p-2 border rounded"
          value={searchValue}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <div style={{ minWidth: "800px" }}>
            {/* Header */}
            <div className="flex bg-gray-50 border-b">
              {COLUMNS.map(({ key, label, width }) => (
                <div
                  key={key}
                  style={{ width }}
                  className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer flex items-center ${
                    key === "streamCount" ? "justify-end" : "justify-start"
                  }`}
                  onClick={() => handleSort(key)}
                >
                  <span className="flex items-center">
                    {label}
                    <SortIcon column={key} />
                  </span>
                </div>
              ))}
            </div>

            {/* Virtualized List */}
            <FixedSizeList
              height={400}
              width="100%"
              itemCount={sortedData.length}
              itemSize={ROW_HEIGHT}
              className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
            >
              {Row}
            </FixedSizeList>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamsTable;
