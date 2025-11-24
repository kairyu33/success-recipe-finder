/**
 * 検索バーコンポーネント - インラインスタイル版
 */

'use client';

import { useState } from 'react';

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function SearchBar({
  value,
  onChange,
  placeholder = 'キーワードで検索...',
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div style={{
      position: 'relative',
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(12px)',
      border: isFocused ? '1px solid #a855f7' : '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '8px',
      transition: 'all 0.2s'
    }}>
      {/* Search icon */}
      <div style={{
        position: 'absolute',
        left: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        pointerEvents: 'none'
      }}>
        <svg
          style={{ width: '16px', height: '16px', flexShrink: 0 }}
          fill="none"
          stroke="#9ca3af"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Search input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        style={{
          width: '100%',
          paddingLeft: '32px',
          paddingRight: value ? '32px' : '8px',
          paddingTop: '6px',
          paddingBottom: '6px',
          background: 'transparent',
          border: 'none',
          borderRadius: '6px',
          color: '#1e293b',
          fontSize: '14px',
          outline: 'none'
        }}
      />

      {/* Clear button */}
      {value && (
        <button
          onClick={() => onChange('')}
          aria-label="クリア"
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            padding: '4px',
            background: 'none',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f5f5f5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'none';
          }}
        >
          <svg
            style={{ width: '14px', height: '14px', flexShrink: 0 }}
            fill="none"
            stroke="#9ca3af"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
