import React from "react";

const cultures = [
  { value: "all", label: "All Cultures" },
  { value: "maori", label: "Māori" },
  { value: "aboriginal", label: "Aboriginal" },
  { value: "pacific_islander", label: "Pacific Islander" },
];

export default function CultureFilter({ value, onChange }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {cultures.map((c) => (
        <button
          key={c.value}
          onClick={() => onChange(c.value)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
            value === c.value
              ? "bg-[#B51D19] text-white"
              : "bg-[#242424] text-gray-400 hover:text-white hover:bg-[#2E2E2E] border border-[#333]"
          }`}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}