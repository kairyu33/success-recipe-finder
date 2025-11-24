/**
 * ソート選択コンポーネント - Stylish Pastel Design
 */

'use client';

type SortOption = {
  value: string;
  label: string;
  icon: string;
};

type SortSelectorProps = {
  value: string;
  onChange: (value: string) => void;
};

const sortOptions: SortOption[] = [
  { value: 'publishedAt-desc', label: '公開日（新しい順）', icon: '📅' },
  { value: 'publishedAt-asc', label: '公開日（古い順）', icon: '📆' },
  { value: 'characterCount-desc', label: '文字数（多い順）', icon: '📝' },
  { value: 'characterCount-asc', label: '文字数（少ない順）', icon: '📄' },
  { value: 'estimatedReadTime-desc', label: '読了時間（長い順）', icon: '⏱️' },
  { value: 'estimatedReadTime-asc', label: '読了時間（短い順）', icon: '⚡' },
];

export function SortSelector({ value, onChange }: SortSelectorProps) {
  const selectedOption = sortOptions.find((opt) => opt.value === value) || sortOptions[0];

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">
        並び順:
      </label>
      <div className="relative flex-1">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none pl-3 pr-9 py-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:border-indigo-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all duration-200 outline-none cursor-pointer"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.icon} {option.label}
            </option>
          ))}
        </select>

        {/* Custom dropdown icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="w-4 h-4 flex-shrink-0 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
