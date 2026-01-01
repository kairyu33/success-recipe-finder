/**
 * 複数選択可能なフィルターコンポーネント - 常に表示型
 */

'use client';

import { getGenreGradientSelected, getGenreGradientHover } from '@/app/utils/genreColors';

type MultiSelectFilterProps = {
  label: string;
  values: string[];
  options: Array<{ value: string; label: string }>;
  onChange: (values: string[]) => void;
  placeholder?: string;
  isGenreFilter?: boolean;
};

export function MultiSelectFilter({
  label,
  values,
  options,
  onChange,
  isGenreFilter = false,
}: MultiSelectFilterProps) {
  const toggleOption = (value: string) => {
    if (values.includes(value)) {
      onChange(values.filter((v) => v !== value));
    } else {
      onChange([...values, value]);
    }
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div>
      <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label style={{ fontSize: '14px', fontWeight: '600', color: '#334155' }}>
          {label}
          {values.length > 0 && (
            <span style={{
              marginLeft: '8px',
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: '12px',
              background: 'linear-gradient(to right, #f3e8ff, #fce7f3)',
              color: '#7e22ce',
              fontWeight: '700'
            }}>
              {values.length}個
            </span>
          )}
        </label>
        {values.length > 0 && (
          <button
            onClick={clearAll}
            style={{
              fontSize: '11px',
              fontWeight: '600',
              color: '#7e22ce',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '2px 6px'
            }}
          >
            クリア
          </button>
        )}
      </div>

      <div style={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '8px',
        maxHeight: '200px',
        overflowY: 'auto',
        overflowX: 'hidden'
      }}
      className="custom-scrollbar">
        {options.map((option) => {
          const isSelected = values.includes(option.value);
          const selectedBg = isGenreFilter
            ? getGenreGradientSelected(option.value)
            : 'linear-gradient(to right, #f3e8ff, #fce7f3)';
          const hoverBg = isGenreFilter
            ? getGenreGradientHover(option.value)
            : 'linear-gradient(to right, #faf5ff, #fdf2f8)';

          return (
            <label
              key={option.value}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 8px',
                borderRadius: '6px',
                cursor: 'pointer',
                background: isSelected ? selectedBg : 'transparent',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.background = hoverBg;
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleOption(option.value)}
                  style={{
                    position: 'absolute',
                    opacity: 0,
                    width: '1px',
                    height: '1px'
                  }}
                />
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '4px',
                    border: isSelected ? '1px solid #a855f7' : '1px solid #cbd5e1',
                    background: isSelected ? 'linear-gradient(to bottom right, #a855f7, #ec4899)' : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s'
                  }}
                >
                  {isSelected && (
                    <svg
                      style={{ width: '12px', height: '12px', flexShrink: 0 }}
                      fill="none"
                      stroke="white"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </div>

              <span
                style={{
                  fontSize: '14px',
                  flex: 1,
                  fontWeight: isSelected ? '600' : '400',
                  color: isSelected ? '#7e22ce' : '#334155',
                  transition: 'color 0.2s'
                }}
              >
                {option.label}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
