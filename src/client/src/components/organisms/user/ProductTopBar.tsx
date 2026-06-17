import { Input } from "@heroui/react";
import type React from "react";
import { HiChevronDown, HiOutlineFilter } from "react-icons/hi";

type SortOption = { key: string; label: string };

type Props = {
  onFilterOpen: () => void;
  hasActiveFilters: boolean;
  searchInput: string;
  onSearchChange: (value: string) => void;
  sortValue: string;
  onSortChange: (value: string) => void;
  sortOptions: SortOption[];
};

const ProductTopBar: React.FC<Props> = ({
  onFilterOpen,
  hasActiveFilters,
  searchInput,
  onSearchChange,
  sortValue,
  onSortChange,
  sortOptions,
}) => (
  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
    <button
      className="md:hidden shrink-0 flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-600 hover:bg-gray-50"
      onClick={onFilterOpen}
      aria-label="Open filters"
    >
      <HiOutlineFilter className="w-4 h-4" />
      Filters
      {hasActiveFilters && (
        <span className="ml-1 w-2 h-2 rounded-full bg-primary-500 inline-block" />
      )}
    </button>

    <Input
      type="text"
      placeholder="Search by name, category or sub-category..."
      value={searchInput}
      onChange={(e) => onSearchChange(e.target.value)}
      className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white min-w-0"
    />

    <div className="shrink-0 w-full sm:w-52 relative">
      <select
        aria-label="Sort products"
        value={sortValue}
        onChange={(e) => onSortChange(e.target.value)}
        className="w-full appearance-none px-3 py-2.5 pr-9 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer"
      >
        {sortOptions.map((opt) => (
          <option key={opt.key} value={opt.key}>
            {opt.label}
          </option>
        ))}
      </select>
      <HiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
    </div>
  </div>
);

export default ProductTopBar;
