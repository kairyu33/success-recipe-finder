/**
 * メンバーシップタグコンポーネント
 */

'use client';

import type { Article } from '@/types';

type MembershipTagsProps = {
  memberships: Article['memberships'];
};

export function MembershipTags({ memberships }: MembershipTagsProps) {
  if (memberships.length === 0) return null;

  return (
    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
      {memberships.map((m) => (
        <span
          key={m.membership.id}
          style={{
            fontSize: '10px',
            padding: '2px 6px',
            borderRadius: '5px',
            color: 'white',
            fontWeight: '600',
            background: m.membership.color || '#41c9b4',
            whiteSpace: 'nowrap'
          }}
        >
          {m.membership.name}
        </span>
      ))}
    </div>
  );
}
