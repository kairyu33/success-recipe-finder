/**
 * メンバーシップフィルターコンポーネント - Premium Redesign
 */

'use client';

import type { Membership } from '@/types';

type MembershipFilterProps = {
  memberships: Membership[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export function MembershipFilter({
  memberships,
  selectedId,
  onSelect,
}: MembershipFilterProps) {
  return (
    <div className="space-y-2">
      {/* Label */}
      <label className="block text-sm font-semibold text-neutral-700">
        メンバーシップで絞り込み
      </label>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2">
        {/* All button */}
        <button
          onClick={() => onSelect('')}
          className={`relative px-3 py-1.5 rounded-lg font-semibold transition-all duration-300 overflow-hidden group text-sm ${
            selectedId === ''
              ? 'bg-gradient-primary text-white shadow-primary scale-105'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:scale-105'
          }`}
        >
          {selectedId === '' && (
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          )}
          <span className="relative z-10 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            すべて
          </span>
        </button>

        {/* Membership buttons */}
        {memberships.map((membership) => {
          const isSelected = selectedId === membership.id;
          const bgColor = membership.color || '#41c9b4';

          return (
            <button
              key={membership.id}
              onClick={() => onSelect(membership.id)}
              className={`relative px-3 py-1.5 rounded-lg font-semibold transition-all duration-300 overflow-hidden group text-sm ${
                isSelected
                  ? 'text-white shadow-lg scale-105'
                  : 'opacity-80 hover:opacity-100 hover:scale-105'
              }`}
              style={{
                backgroundColor: isSelected ? bgColor : `${bgColor}20`,
                color: isSelected ? 'white' : bgColor,
                boxShadow: isSelected ? `0 10px 40px -12px ${bgColor}66` : 'none',
              }}
            >
              {/* Shine effect */}
              {isSelected && (
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              )}

              {/* Button content */}
              <span className="relative z-10 flex items-center gap-1.5">
                {isSelected && (
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {membership.name}
              </span>

              {/* Glow effect on hover */}
              {!isSelected && (
                <span
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  style={{ backgroundColor: bgColor }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Active filter indicator */}
      {selectedId && (
        <div className="flex items-center gap-2 text-sm text-primary-600 animate-fade-in">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">フィルター適用中</span>
        </div>
      )}
    </div>
  );
}
