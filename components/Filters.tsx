"use client";

import { LEVELS, STATUSES } from "@/lib/constants";

const selectClass =
  "rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-gray-700 focus:border-gray-400 focus:outline-none";

interface FiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  level: string;
  onLevelChange: (value: string) => void;
  city: string;
  onCityChange: (value: string) => void;
  cities: string[];
}

export default function Filters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  level,
  onLevelChange,
  city,
  onCityChange,
  cities,
}: FiltersProps) {
  return (
    <section className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2">
      <input
        type="search"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search school, city, program, notes…"
        className="min-w-[220px] flex-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
      />

      <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
        Status
        <select
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
          className={selectClass}
        >
          <option value="All">All</option>
          {STATUSES.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
        Level
        <select
          value={level}
          onChange={(event) => onLevelChange(event.target.value)}
          className={selectClass}
        >
          <option value="All">All</option>
          {LEVELS.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
        City
        <select
          value={city}
          onChange={(event) => onCityChange(event.target.value)}
          className={selectClass}
        >
          <option value="All">All</option>
          {cities.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>
    </section>
  );
}
