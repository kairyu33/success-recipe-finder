/**
 * 汎用セレクトフィルターコンポーネント - Premium Redesign
 */

'use client';

type SelectFilterProps = {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function SelectFilter({
  label,
  value,
  options,
  onChange,
  placeholder = '選択してください',
}: SelectFilterProps) {
  return (
    <div className="relative">
      {/* Label */}
      <label className="block text-sm font-semibold text-neutral-700 mb-2.5">
        {label}
      </label>

      {/* Select wrapper for custom styling */}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none pl-4 pr-12 py-3.5 bg-white border-2 border-neutral-200 rounded-xl text-neutral-800 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all duration-300 outline-none cursor-pointer hover:border-neutral-300"
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom dropdown icon */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="w-5 h-5 text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {/* Selected indicator dot */}
        {value && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 -translate-x-2">
            <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse-subtle" />
          </div>
        )}
      </div>
    </div>
  );
}
